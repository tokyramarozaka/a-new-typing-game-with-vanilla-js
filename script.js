/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */

// ─── ÉTAT ─────────────────────────────────────────────────────────────────────

const state = {
  difficulty: "easy",
  words: [],
  currentIndex: 0,
  startTime: null,
  countdown: null,
  totalCharsTyped: 0,
  totalErrors: 0,
  wordsTyped: 0,
  wordsCorrect: 0, 
  timerDuration: 30,
  timerRunning: false,
  wpmHistory: [], 
};

// ─── LISTES DE MOTS ───────────────────────────────────────────────────────────

const wordLists = {
  easy:   ["apple","banana","grape","orange","cherry","table","house","mouse","water","green"],
  medium: ["keyboard","monitor","printer","charger","battery","network","computer","browser","desktop","project"],
  hard:   ["synchronize","complicated","development","extravagant","misconception","architecture","communication","implementation","responsibility","configuration"],
};

// ─── DOM ──────────────────────────────────────────────────────────────────────

const wordDisplay = document.getElementById("word-display");
const inputField  = document.getElementById("input-field");
const timeSelect  = document.getElementById("Time");
const btnRestart  = document.querySelector(".btn-restart");

const easyPill    = document.getElementById("easy-pill");
const mediumPill  = document.getElementById("medium-pill");
const hardPill    = document.getElementById("hard-pill");

const elWpm       = document.querySelector("#wpm .wpm");
const elAcc       = document.querySelector("#accuracy .accuracy");
const elTyped     = document.querySelector("#typed .typed");
const elTime      = document.querySelector("#time .time");

// ─── DIFFICULTÉ ───────────────────────────────────────────────────────────────

function updateDifficultyUI() {
  easyPill.classList.remove("active-easy");
  mediumPill.classList.remove("active-medium");
  hardPill.classList.remove("active-hard");
  const map = { easy: easyPill, medium: mediumPill, hard: hardPill };
  const cls = { easy: "active-easy", medium: "active-medium", hard: "active-hard" };
  map[state.difficulty].classList.add(cls[state.difficulty]);
}

easyPill.addEventListener("click",   () => changeDifficulty("easy"));
mediumPill.addEventListener("click", () => changeDifficulty("medium"));
hardPill.addEventListener("click",   () => changeDifficulty("hard"));

function changeDifficulty(level) {
  state.difficulty = level;
  updateDifficultyUI();
  startTest();
}

// ─── DÉMARRAGE ────────────────────────────────────────────────────────────────

function startTest() {
  clearInterval(state.countdown);

  Object.assign(state, {
    words: [],
    currentIndex: 0,
    startTime: null,
    countdown: null,
    totalCharsTyped: 0,
    totalErrors: 0,
    wordsTyped: 0,
    wordsCorrect: 0,
    timerDuration: parseInt(timeSelect.value),
    timerRunning: false,
    wpmHistory: [],
    charsAtLastSecond: 0,
  });

  // Reset UI stats
  elWpm.textContent   = "—";
  elAcc.textContent   = "—";
  elTyped.textContent = "0";
  elTime.innerHTML    = `${state.timerDuration}<span class="stat-unit">s</span>`;

  // Reset input
  inputField.value    = "";
  inputField.disabled = false;
  inputField.focus();

  // Reset résultats + graphique
  hideResults();
  initChart();

  // Générer les mots
  const list = wordLists[state.difficulty];
  for (let i = 0; i < 50; i++) {
    state.words.push(list[Math.floor(Math.random() * list.length)]);
  }

  renderWords();
  highlightWord(0);
}

// ─── RENDU DES MOTS ───────────────────────────────────────────────────────────

function renderWords() {
  wordDisplay.innerHTML = "";

  state.words.forEach((word, wi) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";
    wordSpan.dataset.index = wi;

    word.split("").forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.className = "char";
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });

    const space = document.createElement("span");
    space.className = "space";
    space.textContent = " ";
    wordSpan.appendChild(space);

    wordDisplay.appendChild(wordSpan);
  });
}

function highlightWord(index) {
  const wordEls = wordDisplay.querySelectorAll(".word");
  wordEls.forEach(el => el.classList.remove("current-word"));
  if (wordEls[index]) wordEls[index].classList.add("current-word");
}

// ─── TIMER ────────────────────────────────────────────────────────────────────

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  state.startTime = Date.now();

  let remaining = state.timerDuration;

  state.countdown = setInterval(() => {
    remaining--;
    const elapsed = state.timerDuration - remaining;

    elTime.innerHTML = `${remaining}<span class="stat-unit">s</span>`;

    // Snapshot WPM + précision chaque seconde pour le graphique
    recordSnapshot(elapsed);

    if (remaining <= 0) {
      clearInterval(state.countdown);
      endGame();
    }
  }, 1000);
}

function recordSnapshot(second) {
  const charsThisSecond = state.totalCharsTyped - state.charsAtLastSecond;
  const wpmInstant = Math.round((charsThisSecond / 5) * 60);
  state.charsAtLastSecond = state.totalCharsTyped;

  const correctChars = state.totalCharsTyped - state.totalErrors;
  const accuracy = state.totalCharsTyped > 0
    ? Math.round((correctChars / state.totalCharsTyped) * 100)
    : 100;

  state.wpmHistory.push({ second, wpm: wpmInstant, accuracy });
  pushChartPoint(second, wpmInstant, accuracy);
}

// ─── FRAPPE ───────────────────────────────────────────────────────────────────

inputField.addEventListener("input", () => {
  if (!state.timerRunning) startTimer();
  renderCurrentWordFeedback();
});

inputField.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    validateWord();
  }
});

function renderCurrentWordFeedback() {
  const typed       = inputField.value;
  const currentWord = state.words[state.currentIndex];
  const wordEl      = wordDisplay.querySelectorAll(".word")[state.currentIndex];
  if (!wordEl) return;

  const charEls = wordEl.querySelectorAll(".char");

  charEls.forEach((charEl, i) => {
    charEl.classList.remove("char-correct", "char-wrong", "char-cursor");

    if (i < typed.length) {
      charEl.classList.add(typed[i] === currentWord[i] ? "char-correct" : "char-wrong");
    }
    if (i === typed.length) {
      charEl.classList.add("char-cursor");
    }
  });

  wordEl.classList.toggle("word-overflow", typed.length > currentWord.length);
}

function validateWord() {
  const typed       = inputField.value.trim();
  const currentWord = state.words[state.currentIndex];
  if (typed === "") return;

  // Compter les erreurs lettre par lettre
  let wordErrors = 0;
  for (let i = 0; i < Math.max(typed.length, currentWord.length); i++) {
    if (typed[i] !== currentWord[i]) wordErrors++;
  }

  const isCorrect = wordErrors === 0;

  state.totalCharsTyped += currentWord.length;
  state.totalErrors     += wordErrors;
  state.wordsTyped++;
  if (isCorrect) state.wordsCorrect++;

  // Feedback visuel sur le mot
  const wordEl = wordDisplay.querySelectorAll(".word")[state.currentIndex];
  if (wordEl) {
    wordEl.classList.add(isCorrect ? "word-correct" : "word-wrong");
    wordEl.classList.remove("current-word", "word-overflow");
  }

  state.currentIndex++;
  inputField.value = "";

  updateStats();
  highlightWord(state.currentIndex);
  scrollToCurrentWord();
}

// ─── STATS EN DIRECT ──────────────────────────────────────────────────────────

function updateStats() {
  const elapsed = (Date.now() - state.startTime) / 1000 / 60;
  const wpm = elapsed > 0
    ? Math.round((state.totalCharsTyped / 5) / elapsed)
    : 0;

  const correctChars = state.totalCharsTyped - state.totalErrors;
  const accuracy = state.totalCharsTyped > 0
    ? Math.round((correctChars / state.totalCharsTyped) * 100)
    : 100;

  elWpm.textContent   = wpm;
  elAcc.textContent   = `${accuracy}%`;
  elTyped.textContent = state.wordsTyped;
}

// ─── FIN DE PARTIE ────────────────────────────────────────────────────────────

function endGame() {
  inputField.disabled = true;
  wordDisplay.querySelectorAll(".char-cursor")
    .forEach(el => el.classList.remove("char-cursor"));

  // Stats finales
  const elapsedMin = state.timerDuration / 60;
  const wpm = Math.round((state.totalCharsTyped / 5) / elapsedMin);
  const correctChars = state.totalCharsTyped - state.totalErrors;
  const accuracy = state.totalCharsTyped > 0
    ? Math.round((correctChars / state.totalCharsTyped) * 100)
    : 0;

  elWpm.textContent   = wpm;
  elAcc.textContent   = `${accuracy}%`;
  elTyped.textContent = state.wordsTyped;

  showResults(wpm, accuracy);
}

// ─── SCORE / GRADE ────────────────────────────────────────────────────────────

function getGrade(wpm, accuracy) {
  const worst = { grade: "F", color: "#F87171", label: "Recommence !" };

   if (accuracy <= 0 || wpm <= 0) {
    return worst;
  }

  const wpmRef  = { easy: 60, medium: 50, hard: 35 };
  const ref     = wpmRef[state.difficulty];
  const wpmScore = Math.min((wpm / ref) * 100, 100);
  const composite = wpmScore * 0.7 + accuracy * 0.3;

  if (composite >= 95) {
    return { grade: "S", color: "#F59E0B", label: "Parfait !" };
  }
  if (composite >= 85){
    return { grade: "A", color: "#34D399", label: "Excellent !"};
    }
    
  if (composite >= 70) {
   return { grade: "B", color: "#14B8C6", label: "Bien joué" };
  }
    
  if (composite >= 55){
    return { grade: "C", color: "#A78BFA", label: "Correct" };
  } 
  if (composite >= 40) {
    return { grade: "D", color: "#FB923C", label: "À améliorer" };
  }
  return  worst;
}

// ─── RÉSULTATS ────────────────────────────────────────────────────────────────

function showResults(wpm, accuracy) {
  const { grade, color, label } = getGrade(wpm, accuracy);
  const cpm        = Math.round(wpm * 5);
  const wordsWrong = state.wordsTyped - state.wordsCorrect;

  const resultsPanel = document.querySelector(".results-panel");
  if (!resultsPanel) return;

  resultsPanel.innerHTML = `
    <div class="results-title">Résultats de la partie</div>

    <div class="results-body">

      <div class="result-grade" style="--grade-color: ${color}">
        <div class="grade-letter">${grade}</div>
        <div class="grade-label">${label}</div>
      </div>

      <div class="result-stats">
        <div class="result-stat">
          <span class="result-stat-value" style="color:#14B8C6">${wpm}</span>
          <span class="result-stat-label">WPM</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-value" style="color:#A78BFA">${accuracy}%</span>
          <span class="result-stat-label">Précision</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-value" style="color:#F472B6">${cpm}</span>
          <span class="result-stat-label">CPM</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-value" style="color:#34D399">${state.wordsCorrect}</span>
          <span class="result-stat-label">Mots corrects</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-value" style="color:#F87171">${wordsWrong}</span>
          <span class="result-stat-label">Mots ratés</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-value" style="color:#94A3B8">${state.timerDuration}s</span>
          <span class="result-stat-label">Durée</span>
        </div>
      </div>

      <div class="resultConatiner">
        <div class="result-chart-title">WPM &amp; Précision dans le temps</div>
        <div class="chart-wrapper">
          <canvas id="performanceChart"></canvas>
        </div>
      </div>

    </div>
  `;

  // Recréer le graphique dans le nouveau canvas et rejouer l'historique
  initChart();
  state.wpmHistory.forEach(p => pushChartPoint(p.second, p.wpm, p.accuracy));

  // Animation d'entrée
  resultsPanel.classList.add("results-visible");
}

function hideResults() {
  const resultsPanel = document.querySelector(".results-panel");
  if (!resultsPanel) return;

  resultsPanel.classList.remove("results-visible");
  resultsPanel.innerHTML = `
    <div class="resultConatiner">
      <div class="results-title">Résultats de la partie</div>
      <div class="chart-wrapper">
        <canvas id="performanceChart"></canvas>
      </div>
    </div>
  `;
}

// ─── GRAPHIQUE ────────────────────────────────────────────────────────────────

let performanceChart = null;

function initChart() {
  const ctx = document.getElementById("performanceChart");
  if (!ctx) return;

  if (performanceChart) {
    performanceChart.destroy();
    performanceChart = null;
  }

  performanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "WPM",
          data: [],
          borderColor: "#14B8C6",
          backgroundColor: "rgba(20,184,198,0.08)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#14B8C6",
          tension: 0.4,
          fill: true,
          yAxisID: "yWpm",
        },
        {
          label: "Précision %",
          data: [],
          borderColor: "#A78BFA",
          backgroundColor: "rgba(167,139,250,0.05)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#A78BFA",
          tension: 0.4,
          fill: false,
          yAxisID: "yAcc",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: {
            color: "#94A3B8",
            font: { family: "DM Sans", size: 11 },
            boxWidth: 12,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: "#1E293B",
          borderColor: "#334155",
          borderWidth: 1,
          titleColor: "#F1F5F9",
          bodyColor: "#94A3B8",
          padding: 10,
          callbacks: {
            title: (items) => `${items[0].label}s`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "#64748B", font: { size: 11 } },
          title: { display: true, text: "Secondes", color: "#64748B", font: { size: 11 } },
        },
        yWpm: {
          type: "linear",
          position: "left",
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "#14B8C6", font: { size: 11 } },
          title: { display: true, text: "WPM", color: "#14B8C6", font: { size: 11 } },
        },
        yAcc: {
          type: "linear",
          position: "right",
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
          ticks: {
            color: "#A78BFA",
            font: { size: 11 },
            callback: (v) => v + "%",
          },
          title: { display: true, text: "Précision", color: "#A78BFA", font: { size: 11 } },
        },
      },
    },
  });
}

function pushChartPoint(second, wpm, accuracy) {
  if (!performanceChart) return;
  performanceChart.data.labels.push(second);
  performanceChart.data.datasets[0].data.push(wpm);
  performanceChart.data.datasets[1].data.push(accuracy);
  performanceChart.update("none");
}

// ─── SCROLL AUTO ─────────────────────────────────────────────────────────────

function scrollToCurrentWord() {
  const wordEls = wordDisplay.querySelectorAll(".word");
  const current = wordEls[state.currentIndex];
  if (current) current.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ─── EVENTS GLOBAUX ───────────────────────────────────────────────────────────

btnRestart.addEventListener("click", startTest);
timeSelect.addEventListener("change", startTest);

// ─── LANCEMENT ────────────────────────────────────────────────────────────────

updateDifficultyUI();
startTest();