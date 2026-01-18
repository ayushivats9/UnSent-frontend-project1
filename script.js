//GLOBAL

let currentIndex = null;
let currentBlankIndex = null;

const modal = document.getElementById("letter-modal");
const paper = document.getElementById("burn-paper");

//LETTER

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

function autosaveDraft() {
  const pages = getLetterPages();
  localStorage.setItem("draftPages", JSON.stringify(pages));
}

//autosave
paper.addEventListener("input", autosaveDraft);

//PAGES

function getLetterPages() {
  return [...paper.querySelectorAll("textarea")]
    .map(t => t.value.trim())
    .filter(Boolean);
}

function clearLetterPages() {
  paper.querySelectorAll(".letter-page").forEach(p => p.remove());
  document.getElementById("letter-text").value = "";
}
function addLetterPage() {
  const scroll = document.getElementById("letter-scroll");

  const textarea = document.createElement("textarea");
  textarea.className = "letter-text";
  textarea.placeholder = "Continue writing...";

  scroll.appendChild(textarea);

  textarea.focus();
}


//SAVE

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

//burn

function burnLetter() {
  if (!confirm("Burn this letter forever?")) return;

  paper.classList.add("burn");

  setTimeout(() => {
    clearLetterPages();
    localStorage.removeItem("draftPages");
    paper.classList.remove("burn");
    closeLetter();
  }, 1500);
}

//Storage

function getLetters() {
  return JSON.parse(localStorage.getItem("letters")) || [];
}

function loadSavedLetters() {
  const list = document.getElementById("letters-list");
  list.innerHTML = "";

  getLetters().forEach((l, i) => {
    const li = document.createElement("li");
    li.textContent = l.title;
    li.onclick = () => openSaved(i);
    list.appendChild(li);
  });
}

function openSaved(index) {
  const letters = getLetters();
  const letter = letters[index];

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

//SAVED PANEL

function toggleSavedLetters() {
  document
    .getElementById("saved-letters-panel")
    .classList.toggle("active");
}

window.onload = loadSavedLetters;

//BLANK PAGE

const blankModal = document.getElementById("blank-modal");
const blankPaper = document.querySelector(".blank-paper");

function openBlank() {
  blankModal.classList.add("active");
}

function closeBlank() {
  blankModal.classList.remove("active");
}

function addBlankPage(text = "") {
 const container = document.querySelector(".blank-paper");
  const actions = document.querySelector(".blank-actions");

  const page = document.createElement("div");
  page.className = "quiet-page";

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Continue writing...";
  textarea.style.width = "100%";
  textarea.style.height = "250px";
  textarea.style.background = "rgba(0,0,0,0.55)";
  textarea.style.color = "#eee";
  textarea.style.border = "none";
  textarea.style.outline = "none";
  textarea.style.resize = "none";

  page.appendChild(textarea);
  container.insertBefore(page, actions);
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
  closeBlank();
}

function burnBlankPage() {
  if (!confirm("Burn this page forever?")) return;

  blankPaper.classList.add("burn");

  setTimeout(() => {
    blankPaper.querySelectorAll(".blank-page").forEach(p => p.remove());
    blankPaper.classList.remove("burn");
    closeBlank();
  }, 1200);
}
