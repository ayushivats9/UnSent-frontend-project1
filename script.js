// GLOBAL
let currentIndex = null;
let currentBlankIndex = null;

const modal = document.getElementById("letter-modal");
const paper = document.getElementById("burn-paper");
const blankModal = document.getElementById("blank-modal");
const blankPaper = document.querySelector(".blank-paper");


// letter

function openLetter() {
  modal.classList.add("active");
  loadDraft();
}

function closeLetter() {
  modal.classList.remove("active");
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem("draftPages"));
  if (!draft) return;

  clearLetterPages();
  draft.forEach((t, i) => {
    if (i === 0) {
      document.getElementById("letter-text").value = t;
    } else {
      addLetterPage(t);
    }
  });
}

paper.addEventListener("input", () => {
  const pages = getLetterPages();
  localStorage.setItem("draftPages", JSON.stringify(pages));
});


//pages

function getLetterPages() {
  return [...paper.querySelectorAll("textarea")]
    .map(t => t.value.trim())
    .filter(Boolean);
}

function clearLetterPages() {
  paper.querySelectorAll(".letter-page").forEach(p => p.remove());
  document.getElementById("letter-text").value = "";
}

function addLetterPage(text = "") {
  const scroll = document.getElementById("letter-scroll");

  const textarea = document.createElement("textarea");
  textarea.className = "letter-text";
  textarea.placeholder = "Continue writing...";
  textarea.value = text;

  scroll.appendChild(textarea);
}


//save letter

function saveLetter() {
  const pages = getLetterPages();
  if (!pages.length) return alert("Letter is empty");

  const title = prompt("Name your letter:");
  if (!title) return;

  const letters = getLetters();
  letters.push({ title, pages });

  localStorage.setItem("letters", JSON.stringify(letters));
  localStorage.removeItem("draftPages");

  clearLetterPages();
  loadSavedLetters();
  closeLetter();
}


//Storage

function getLetters() {
  return JSON.parse(localStorage.getItem("letters")) || [];
}


//saved panel

function loadSavedLetters() {
  const list = document.getElementById("letters-list");
  list.innerHTML = "";

  // LETTERS
  getLetters().forEach((l, i) => {
    const li = document.createElement("li");
    li.textContent = "✉️ " + l.title;
    li.onclick = () => openSavedLetter(i);
    list.appendChild(li);
  });

  // QUIET PAGES
  const blanks = JSON.parse(localStorage.getItem("blankPages")) || [];
  blanks.forEach((b, i) => {
    const li = document.createElement("li");
    li.textContent = "🌙 " + b.title;
    li.onclick = () => openSavedBlank(i); 
    list.appendChild(li);
  });
}


//OPEN SAVED LETTER

function openSavedLetter(index) {
  const letters = getLetters();
  const letter = letters[index];

  if (!letter || !Array.isArray(letter.pages) || !letter.pages.length) {
    alert("This saved letter is corrupted and will be removed.");
    letters.splice(index, 1);
    localStorage.setItem("letters", JSON.stringify(letters));
    loadSavedLetters();
    return;
  }

  clearLetterPages();
  letter.pages.forEach((t, i) => {
    if (i === 0) {
      document.getElementById("letter-text").value = t;
    } else {
      addLetterPage(t);
    }
  });

  currentIndex = index;
  openLetter();
}


//OPEN SAVED QUIET PAGE
function openSavedBlank(index) {
  const blanks = JSON.parse(localStorage.getItem("blankPages")) || [];
  const blank = blanks[index];

  if (!blank || !Array.isArray(blank.pages) || !blank.pages.length) {
    alert("This saved page is corrupted and will be removed.");
    blanks.splice(index, 1);
    localStorage.setItem("blankPages", JSON.stringify(blanks));
    loadSavedLetters();
    return;
  }

  blankPaper.querySelectorAll(".quiet-page").forEach(p => p.remove());

  blank.pages.forEach(text => {
    addBlankPage(text);
  });

  currentBlankIndex = index;
  blankModal.classList.add("active");
}


// blank page

function openBlank() {
  blankModal.classList.add("active");
}

function closeBlank() {
  blankModal.classList.remove("active");
}

function addBlankPage(text = "") {
  const actions = document.querySelector(".blank-actions");

  const page = document.createElement("div");
  page.className = "quiet-page";

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Continue writing...";
  textarea.value = text;

  page.appendChild(textarea);
  blankPaper.insertBefore(page, actions);
}

function getBlankPages() {
  return [...blankPaper.querySelectorAll("textarea")]
    .map(t => t.value.trim())
    .filter(Boolean);
}

function saveBlank() {
  const pages = getBlankPages();
  if (!pages.length) return alert("Page is empty");

  const title = prompt("Name this page:");
  if (!title) return;

  const saved = JSON.parse(localStorage.getItem("blankPages")) || [];
  saved.push({ title, pages });

  localStorage.setItem("blankPages", JSON.stringify(saved));
  loadSavedLetters();
  closeBlank();
}


// panel

function toggleSavedLetters() {
  document
    .getElementById("saved-letters-panel")
    .classList.toggle("active");
}

window.onload = loadSavedLetters;
function burnLetter() {
  if (!confirm("Burn this letter forever?")) return;

  paper.classList.add("burn");

  setTimeout(() => {
    //delete from storage if opened from saved
    if (currentIndex !== null) {
      const letters = getLetters();
      letters.splice(currentIndex, 1);
      localStorage.setItem("letters", JSON.stringify(letters));
      currentIndex = null;
    }

    clearLetterPages();
    localStorage.removeItem("draftPages");
    paper.classList.remove("burn");
    closeLetter();
    loadSavedLetters(); // ✅ refresh list
  }, 1200);
}
function burnBlankPage() {
  if (!confirm("Burn this page forever?")) return;

  blankPaper.classList.add("burn");

  setTimeout(() => {
    //delete from storage if opened from saved
    if (currentBlankIndex !== null) {
      const blanks = JSON.parse(localStorage.getItem("blankPages")) || [];
      blanks.splice(currentBlankIndex, 1);
      localStorage.setItem("blankPages", JSON.stringify(blanks));
      currentBlankIndex = null;
    }

    blankPaper.querySelectorAll(".quiet-page").forEach(p => p.remove());
    blankPaper.classList.remove("burn");
    closeBlank();
    loadSavedLetters(); 
  }, 1200);
}
function cleanSavedData() {
  // clean letters
  let letters = JSON.parse(localStorage.getItem("letters")) || [];
  letters = letters.filter(
    l => Array.isArray(l.pages) && l.pages.length > 0
  );
  localStorage.setItem("letters", JSON.stringify(letters));

  // clean quiet pages
  let blanks = JSON.parse(localStorage.getItem("blankPages")) || [];
  blanks = blanks.filter(
    b => Array.isArray(b.pages) && b.pages.length > 0
  );
  localStorage.setItem("blankPages", JSON.stringify(blanks));
}
window.onload = () => {
  cleanSavedData();
  loadSavedLetters();
};
