const GAME_SETTINGS = {
  WORD_COUNT:        50,
  MIN_TIME_SECONDS:  1,
  TIMER_INTERVAL_MS: 1000,
  THEME_KEY:         "typing-theme",
  BEST_KEY:          "typing-best",
  HISTORY_KEY:       "typing-history",
  MAX_HISTORY:       20,
  TIME_BY_MODE: {
    Facile:    60,
    Moyen:     90,
    Difficile: 120,
  },
};

const WORD_BANK = {
  Facile: {
    60: [
      "le chat dort",
      "j'aime jouer",
      "le soleil brille",
      "un vélo neuf",
      "nous mangeons",
      "le chien court",
      "elle lit un livre",
      "les oiseaux volent",
      "le bébé dort",
      "je bois de l'eau",
      "le ciel est bleu",
      "mon chien est gentil",
      "elle aime les chats",
      "nous jouons dehors",
      "la voiture est rouge",
    ],
    90: [
      "le chat dort sur le canapé",
      "j'aime jouer dans le jardin",
      "le soleil brille tous les jours",
      "un vélo neuf pour l'été",
      "nous mangeons ensemble le soir",
      "le chien court dans le parc",
      "elle lit un livre chaque soir",
      "les oiseaux volent dans le ciel",
      "le bébé dort toute la nuit",
      "je bois de l'eau le matin",
      "le ciel est bleu aujourd'hui",
      "mon chien est très gentil",
      "elle aime beaucoup les chats",
      "nous jouons dehors après l'école",
      "la voiture rouge est dans la rue",
    ],
    120: [
      "le chat dort paisiblement sur le canapé du salon",
      "j'aime jouer avec mes amis dans le jardin",
      "le soleil brille et il fait beau aujourd'hui",
      "un vélo neuf pour partir à l'aventure cet été",
      "nous mangeons tous ensemble autour de la grande table",
      "le chien court et saute dans le parc verdoyant",
      "elle lit un bon livre chaque soir avant de dormir",
      "les oiseaux volent haut dans le ciel bleu et clair",
      "le bébé dort toute la nuit sans se réveiller",
      "je bois un grand verre d'eau fraîche chaque matin",
      "le ciel est bleu et les nuages sont blancs",
      "mon chien est très gentil avec les enfants",
      "elle aime beaucoup les chats et les animaux",
      "nous jouons dehors ensemble après l'école chaque jour",
      "la voiture rouge est garée devant la maison",
    ],
  },
  Moyen: {
    60: [
      "taper vite prend du temps",
      "l'écran est allumé",
      "apprendre prend des efforts",
      "le temps est doux",
      "les élèves travaillent bien",
      "une vie saine aide",
      "la tech évolue vite",
      "le clavier est utile",
      "s'entraîner rend parfait",
      "les bonnes habitudes aident",
      "lisez chaque jour",
      "restez concentré au travail",
      "dormir aide la mémoire",
      "buvez de l'eau souvent",
      "le sport fait du bien",
    ],
    90: [
      "taper vite demande de la pratique",
      "l'ordinateur portable est sur le bureau",
      "apprendre demande du temps et des efforts",
      "le temps est agréable pour sortir",
      "les élèves studieux travaillent chaque jour",
      "une vie saine aide vraiment beaucoup",
      "la technologie numérique évolue vite",
      "le clavier mécanique est très utile",
      "la pratique régulière rend parfait",
      "de bonnes habitudes aident à progresser",
      "lire davantage enrichit le vocabulaire",
      "rester concentré améliore le travail",
      "bien dormir améliore la mémoire",
      "buvez assez d'eau dans la journée",
      "faire du sport vous garde en forme",
    ],
    120: [
      "bien taper au clavier demande une pratique régulière",
      "l'ordinateur portable est posé sur le bureau",
      "apprendre une compétence demande des efforts constants",
      "le temps est agréable, idéal pour sortir",
      "les élèves studieux travaillent dur chaque jour",
      "une vie saine et équilibrée aide à se sentir mieux",
      "la technologie numérique évolue et transforme nos usages",
      "le clavier mécanique est un outil très pratique",
      "la pratique régulière finit par rendre les choses faciles",
      "de bonnes habitudes aident à progresser et rester motivé",
      "lire davantage chaque jour enrichit les connaissances",
      "rester concentré sur son travail améliore les résultats",
      "bien dormir chaque nuit améliore la mémoire et la clarté",
      "buvez suffisamment d'eau chaque jour pour rester hydraté",
      "faire du sport vous permet de rester en bonne santé",
    ],
  },
  Difficile: {
    60: [
      "les logiciels exigent de la créativité",
      "s'entraîner améliore la frappe",
      "les algorithmes guident l'ingénierie",
      "l'innovation change le quotidien",
      "les développeurs apprennent sans cesse",
      "gérer son temps est crucial",
      "l'IA redéfinit les secteurs",
      "les détails comptent en code",
      "un code propre est lisible",
      "les bogues sont à repérer",
      "les tests évitent les erreurs",
      "la logique résout les problèmes",
      "les données guident les décisions",
      "coder requiert de la rigueur",
      "documenter le code est essentiel",
    ],
    90: [
      "les logiciels exigent rigueur et créativité",
      "s'entraîner améliore la vitesse de frappe",
      "les algorithmes guident la conception logicielle",
      "l'innovation technologique change notre quotidien",
      "les développeurs apprennent de nouveaux outils",
      "bien gérer son temps améliore le rendement",
      "l'IA redéfinit de nombreux secteurs économiques",
      "les détails sont fondamentaux en programmation",
      "un code propre est plus facile à lire",
      "les bogues subtils sont difficiles à détecter",
      "les tests automatisés évitent beaucoup d'erreurs",
      "une bonne logique aide à résoudre les problèmes",
      "les données analysées guident les décisions",
      "coder proprement requiert discipline et rigueur",
      "documenter le code facilite la maintenance future",
    ],
    120: [
      "développer des logiciels de qualité exige rigueur et créativité",
      "s'entraîner régulièrement améliore sensiblement la vitesse de frappe",
      "les algorithmes efficaces sont au cœur de l'ingénierie logicielle",
      "l'innovation technologique transforme profondément notre vie quotidienne",
      "les développeurs expérimentés apprennent de nouveaux outils en permanence",
      "bien gérer son temps améliore la productivité et le rendement",
      "l'intelligence artificielle redéfinit les frontières de nombreux secteurs",
      "l'attention aux détails est fondamentale en développement logiciel",
      "écrire un code propre et lisible facilite la maintenance future",
      "les bogues subtils sont souvent les plus difficiles à détecter",
      "automatiser les tests permet d'éviter un grand nombre d'erreurs",
      "une logique claire est la clé pour résoudre des défis complexes",
      "analyser les données disponibles aide à prendre de bonnes décisions",
      "coder avec discipline et rigueur produit des logiciels fiables",
      "documenter son code aide toute l'équipe à mieux collaborer",
    ],
  },
};



const els = {
  menuBtn:         document.querySelector("#menuBtn"),
  themeBtn:        document.querySelector("#themeBtn"),
  startBtn:        document.querySelector("#startBtn"),
  pauseBtn:        document.querySelector("#pauseBtn"),
  modeSel:         document.querySelector("#modeSel"),
  timeSel:         document.querySelector("#timeSel"),
  wordLine:        document.querySelector("#wordLine"),
  wordLineWrapper: document.querySelector(".word-line-wrapper"),
  typeInp:         document.querySelector("#typeInp"),
  timeLeft: document.querySelector("#timeLeft"),
  wpmVal:   document.querySelector("#wpmVal"),
  accVal:   document.querySelector("#accVal"),
  scoreVal: document.querySelector("#scoreVal"),
  errVal:   document.querySelector("#errVal"),
  msg:      document.querySelector("#msg"),
  bestMsg:  document.querySelector("#bestMsg"),
  menu:     document.querySelector("#menu"),
  beginBtn: document.querySelector("#beginBtn"),
};


const state = {
  words:           [],
  running:         false,
  paused:          false,
  elapsed:         0,
  timeLeft:        0,
  timerId:         null,
  correctChars:    0,
  wrongChars:      0,
  errors:          0,
  lastTypedLength: 0,
  pausedRemaining: 0,
};



const currentTheme = () =>
  document.documentElement.getAttribute("data-theme") || "dark";

const loadTheme = () =>
  localStorage.getItem(GAME_SETTINGS.THEME_KEY) || "dark";

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  els.themeBtn.textContent =
    theme === "dark" ? "Thème clair" : "Thème sombre";
  localStorage.setItem(GAME_SETTINGS.THEME_KEY, theme);
};



const getSelectedTime = () => {
  const manual = Number(els.timeSel.value);
  return manual > 0
    ? manual
    : GAME_SETTINGS.TIME_BY_MODE[els.modeSel.value];
};

const syncTimeSelToMode = () => {
  els.timeSel.value = String(GAME_SETTINGS.TIME_BY_MODE[els.modeSel.value]);
};



const getRandomPhrase = (list) =>
  list[Math.floor(Math.random() * list.length)];

const buildWords = () => {
  const mode  = els.modeSel.value;
  const time  = getSelectedTime();
  const list  = WORD_BANK[mode][time];
  const words = [];

  for (let i = 0; i < GAME_SETTINGS.WORD_COUNT; i += 1) {
    words.push(getRandomPhrase(list));
  }

  return words;
};

const expectedText = () => state.words.join(" ");



const renderWords = () => {
  const text = expectedText();

  while (els.wordLine.firstChild) {
    els.wordLine.removeChild(els.wordLine.firstChild);
  }

  for (let i = 0; i < text.length; i += 1) {
    const span = document.createElement("span");
    span.className   = "token";
    span.textContent = text[i];
    els.wordLine.appendChild(span);
  }
};

const getTokens = () => els.wordLine.querySelectorAll(".token");

const highlightCurrent = () => {
  const tokens = getTokens();
  let curToken = null;

  tokens.forEach((token, index) => {
    const isCurrent = index === state.lastTypedLength;
    token.classList.toggle("cur", isCurrent);
    if (isCurrent) curToken = token;
  });

  if (curToken !== null) {
    curToken.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
};



const computeWpm = () => {
  const sec = Math.max(state.elapsed, GAME_SETTINGS.MIN_TIME_SECONDS);
  return Math.round((state.correctChars / 5) / (sec / 60));
};

const computeAcc = () => {
  const total = state.correctChars + state.wrongChars;
  if (total === 0) return 0;
  return Math.round((state.correctChars / total) * 100);
};

const updateStats = () => {
  els.timeLeft.textContent = String(state.timeLeft);
  els.wpmVal.textContent   = String(Math.max(computeWpm(), 0));
  els.accVal.textContent   = `${Math.max(computeAcc(), 0)}%`;
  els.scoreVal.textContent = String(state.correctChars);
  els.errVal.textContent   = String(state.errors);
};



const updateBest = (wpm) => {
  const best     = Number(localStorage.getItem(GAME_SETTINGS.BEST_KEY) || "0");
  const nextBest = Math.max(best, wpm);
  localStorage.setItem(GAME_SETTINGS.BEST_KEY, String(nextBest));
  els.bestMsg.textContent = `Meilleur score : ${nextBest} WPM`;
};

const saveHistory = (result) => {
  const raw     = localStorage.getItem(GAME_SETTINGS.HISTORY_KEY) || "[]";
  const history = JSON.parse(raw);
  history.unshift(result);
  localStorage.setItem(
    GAME_SETTINGS.HISTORY_KEY,
    JSON.stringify(history.slice(0, GAME_SETTINGS.MAX_HISTORY))
  );
};



const resetGame = () => {
  clearInterval(state.timerId);

  state.words           = buildWords();
  state.running         = false;
  state.paused          = false;
  state.elapsed         = 0;
  state.timeLeft        = getSelectedTime();
  state.correctChars    = 0;
  state.wrongChars      = 0;
  state.errors          = 0;
  state.lastTypedLength = 0;
  state.pausedRemaining = 0;

  els.typeInp.value        = "";
  els.typeInp.disabled     = true;
  els.pauseBtn.disabled    = true;
  els.pauseBtn.textContent = "Pause";
  els.msg.textContent      = "Appuie sur commencer pour lancer la partie.";

  renderWords();
  highlightCurrent();
  updateStats();
};

const startTimer = () => {
  clearInterval(state.timerId);

  state.timerId = setInterval(() => {
    if (!state.running || state.paused) return;

    state.elapsed  += 1;
    state.timeLeft -= 1;
    updateStats();

    if (state.timeLeft <= 0) {
      finishGame();
    }
  }, GAME_SETTINGS.TIMER_INTERVAL_MS);
};

const startGame = () => {
  resetGame();

  state.running            = true;
  els.typeInp.disabled     = false;
  els.typeInp.focus();
  els.startBtn.textContent = "Recommencer";
  els.pauseBtn.disabled    = false;
  els.msg.textContent      = "La partie a commencé.";

  startTimer();
};

const finishGame = () => {
  if (!state.running) return;

  state.running = false;
  state.paused  = false;
  clearInterval(state.timerId);

  els.typeInp.disabled     = true;
  els.startBtn.textContent = "Commencer";
  els.pauseBtn.disabled    = true;
  els.pauseBtn.textContent = "Pause";

  const wpm = Math.max(computeWpm(), 0);
  const acc = Math.max(computeAcc(), 0);

  const result = {
    date:   new Date().toLocaleString(),
    wpm,
    acc,
    score:  state.correctChars,
    errors: state.errors,
    mode:   els.modeSel.value,
    time:   getSelectedTime(),
  };

  saveHistory(result);
  updateBest(wpm);
  els.msg.textContent = `Terminé : ${wpm} WPM et ${acc}% de précision.`;
  updateStats();
};

const pauseGame = () => {
  if (!state.running) return;

  state.paused = !state.paused;

  if (state.paused) {
    els.pauseBtn.textContent = "Continuer";
    els.msg.textContent      = "Jeu en pause.";
    els.typeInp.disabled     = true;
    state.pausedRemaining    = state.timeLeft;
    clearInterval(state.timerId);
  } else {
    els.pauseBtn.textContent = "Pause";
    els.msg.textContent      = "Partie reprise.";
    els.typeInp.disabled     = false;
    els.typeInp.focus();
    state.timeLeft = state.pausedRemaining;
    startTimer();
  }

  updateStats();
};



const checkTyping = () => {
  if (!state.running || state.paused) return;

  const value    = els.typeInp.value;
  const expected = expectedText();
  const tokens   = getTokens();

  state.correctChars    = 0;
  state.wrongChars      = 0;
  state.errors          = 0;
  state.lastTypedLength = value.length;

  tokens.forEach((token) => token.classList.remove("ok", "bad"));

  for (let i = 0; i < value.length && i < expected.length; i += 1) {
    const correct = value[i] === expected[i];
    tokens[i].classList.add(correct ? "ok" : "bad");

    if (correct) {
      state.correctChars += 1;
    } else {
      state.wrongChars += 1;
      state.errors     += 1;
    }
  }

  if (value.length > expected.length) {
    const extra       = value.length - expected.length;
    state.wrongChars += extra;
    state.errors     += extra;
  }

  updateStats();
  highlightCurrent();
};



const addEvent = (el, event, handler) => {
  if (el !== null) el.addEventListener(event, handler);
};

addEvent(els.themeBtn, "click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});

addEvent(els.startBtn, "click", startGame);
addEvent(els.pauseBtn, "click", pauseGame);

addEvent(els.beginBtn, "click", () => {
  if (els.menu !== null) els.menu.classList.add("hidden");
  startGame();
});

addEvent(els.menuBtn, "click", () => {
  if (els.menu !== null) els.menu.classList.remove("hidden");
  els.typeInp.disabled     = true;
  clearInterval(state.timerId);
  state.running            = false;
  state.paused             = false;
  els.msg.textContent      = "Retour au menu.";
  els.startBtn.textContent = "Commencer";
  els.pauseBtn.textContent = "Pause";
  els.pauseBtn.disabled    = true;
});

addEvent(els.typeInp, "input", checkTyping);

addEvent(els.typeInp, "keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

addEvent(els.modeSel, "change", () => {
  syncTimeSelToMode();
  if (state.running) startGame();
  else resetGame();
});

addEvent(els.timeSel, "change", () => {
  if (state.running) startGame();
  else resetGame();
});



window.addEventListener("load", () => {
  applyTheme(loadTheme());
  updateBest(Number(localStorage.getItem(GAME_SETTINGS.BEST_KEY) || "0"));
  syncTimeSelToMode();
  resetGame();
});