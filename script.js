// MOBILE NAV
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// THEME TOGGLE
const themeToggleBtn = document.getElementById("themeToggle");
const root = document.documentElement;

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light" || storedTheme === "dark") {
  root.setAttribute("data-theme", storedTheme);
} else {
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

function syncToggleButton() {
  const current = root.getAttribute("data-theme");
  if (current === "light") {
    themeToggleBtn.classList.add("light-active");
  } else {
    themeToggleBtn.classList.remove("light-active");
  }
}
syncToggleButton();

themeToggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const nextTheme = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
  syncToggleButton();
});

// TYPING EFFECT
const typingElement = document.getElementById("typing");
const typingTexts = [
  "I create clean web apps.",
  "I love minimal design.",
  "I build with the MERN stack."
];
let textIndex = 0;
let charIndex = 0;
let typingDirection = "forward";

function typeLoop() {
  const currentText = typingTexts[textIndex];

  if (typingDirection === "forward") {
    typingElement.textContent = currentText.slice(0, charIndex++);
    if (charIndex > currentText.length + 10) {
      typingDirection = "backward";
    }
  } else {
    typingElement.textContent = currentText.slice(0, charIndex--);
    if (charIndex < 0) {
      typingDirection = "forward";
      textIndex = (textIndex + 1) % typingTexts.length;
    }
  }

  setTimeout(typeLoop, 90);
}
typeLoop();

// SCROLL REVEAL
const animatedEls = document.querySelectorAll(
  "[data-animate], .about-card, .skill, .project-card, .contact-form, .datetime-card, .game-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-delay") || 0;
        setTimeout(() => {
          entry.target.classList.add("animate-in");

          if (entry.target.classList.contains("skill")) {
            const bar = entry.target.querySelector(".bar");
            const percent = bar.getAttribute("data-percent");
            bar.style.width = percent + "%";
          }
        }, Number(delay));

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.25
  }
);

animatedEls.forEach((el, index) => {
  el.setAttribute("data-delay", index * 60);
  observer.observe(el);
});

// SCROLL TOP BUTTON
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// REAL-TIME DATE & TIME
function updateDateTime() {
  const now = new Date(); // current date/time

  const dateOptions = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };

  const dateStr = now.toLocaleDateString(undefined, dateOptions); // localized date [web:76][web:81][web:85]
  const timeStr = now.toLocaleTimeString(undefined, timeOptions); // localized time [web:77][web:78][web:87]

  const dateEl = document.getElementById("liveDate");
  const timeEl = document.getElementById("liveTime");

  if (dateEl && timeEl) {
    dateEl.textContent = dateStr;
    timeEl.textContent = timeStr;
  }
}
updateDateTime();
setInterval(updateDateTime, 1000); // update every second [web:75][web:79][web:83]

// MINI 4x4 SUDOKU-LIKE GAME
// Simple valid solution pattern (each row/col has 1–4 once) [web:84]
const validMiniSolution = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1]
];

const miniGrid = document.getElementById("miniSudoku");
const checkBtn = document.getElementById("checkMiniSudoku");
const resetBtn = document.getElementById("resetMiniSudoku");
const statusText = document.getElementById("miniStatus");

if (miniGrid && checkBtn && resetBtn && statusText) {
  const cells = Array.from(miniGrid.querySelectorAll("input"));

  // Allow only digits 1-4
  cells.forEach((cell) => {
    cell.addEventListener("input", () => {
      let v = cell.value.replace(/[^1-4]/g, "");
      cell.value = v.slice(0, 1);
      cell.classList.remove("error", "correct");
      statusText.textContent = "";
    });
  });

  checkBtn.addEventListener("click", () => {
    let allFilled = true;
    let allCorrect = true;

    cells.forEach((cell) => cell.classList.remove("error", "correct"));

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const index = r * 4 + c;
        const expected = validMiniSolution[r][c];
        const value = Number(cells[index].value);

        if (!value) {
          allFilled = false;
          allCorrect = false;
          continue;
        }

        if (value === expected) {
          cells[index].classList.add("correct");
        } else {
          cells[index].classList.add("error");
          allCorrect = false;
        }
      }
    }

    if (!allFilled) {
      statusText.textContent = "Fill all cells with numbers 1–4.";
    } else if (allCorrect) {
      statusText.textContent = "Nice! You solved the mini puzzle.";
    } else {
      statusText.textContent = "Some numbers are wrong. Try again.";
    }
  });

  resetBtn.addEventListener("click", () => {
    cells.forEach((cell) => {
      cell.value = "";
      cell.classList.remove("error", "correct");
    });
    statusText.textContent = "";
  });
}
