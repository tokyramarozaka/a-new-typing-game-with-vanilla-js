let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Choisir un mot aléatoire selon la difficulté
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialisation du test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    inputField.disabled = false;
    inputField.value = "";
    results.textContent = "";

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.classList.add("word"); // Pour style éventuel
        if (index === 0) span.style.color = "red";
        wordDisplay.appendChild(span);
    });
};

// Démarre le timer au premier caractère
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calcule les stats du mot actuel
const getCurrentStats = () => {
    const elapsedTime = previousEndTime ? (Date.now() - previousEndTime) / 1000 : 1;
    const word = wordsToType[currentWordIndex];
    const typed = inputField.value.trim();

    const accuracy = typed.length > 0
        ? (word.length / typed.length) * 100
        : 0;

    const wpm = (word.length / 5) / (elapsedTime / 60);

    return {
        wpm: wpm.toFixed(2),
        accuracy: accuracy.toFixed(2)
    };
};

// Highlight mot suivant et reset le précédent
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        for (let i = 0; i < wordElements.length; i++) {
            wordElements[i].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Quand l'utilisateur appuie sur Espace
const updateWord = (event) => {
    if (event.key === " ") {
        event.preventDefault();

        const typed = inputField.value.trim();
        const correctWord = wordsToType[currentWordIndex];
        const wordElements = wordDisplay.children;

        if (typed === correctWord) {
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;

            // Style mot réussi en vert
            wordElements[currentWordIndex].style.color = "green";
        } else {
            // Faux : rouge
            wordElements[currentWordIndex].style.color = "crimson";
        }

        currentWordIndex++;
        previousEndTime = Date.now();
        inputField.value = "";

        if (currentWordIndex >= wordsToType.length) {
            inputField.disabled = true;
            results.textContent += " 🎉 Test terminé !";
        } else {
            highlightNextWord();
        }
    }
};

// Évènements
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Démarrer automatiquement
startTest();
