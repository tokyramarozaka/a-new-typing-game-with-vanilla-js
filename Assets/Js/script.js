/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
const typedHistory = [];
let timerInterval;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const precis = document.getElementById("precis");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 30) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    typedHistory.length = 0;
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    clearInterval(timerInterval);
    document.getElementById("timer").textContent = "⏱ Temps : 0s";
    results.textContent = "";
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";


};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const formattedTime = minutes > 0
                ? `⏱ Temps : ${minutes}m ${seconds}s`
                : `⏱ Temps : ${seconds}s`;
            document.getElementById("timer").textContent = formattedTime;
        }, 1000);
    }
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const totalChars = wordsToType.join("").length;
    let correctChars = 0;

    for (let i = 0; i < wordsToType.length; i++) {
        const expected = wordsToType[i];
        const typed = typedHistory[i] || "";

        for (let j = 0; j < Math.min(expected.length, typed.length); j++) {
            if (expected[j] === typed[j]) {
                correctChars++;
            }
        }
    }

    const totalTimeInMinutes = (Date.now() - startTime) / 1000 / 60;
    const wpm = (totalChars / 5) / totalTimeInMinutes;
    const accuracy = (correctChars / totalChars) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") {

        const typedWord = inputField.value.trim();
        typedHistory.push(typedWord);



        currentWordIndex++;
        previousEndTime = Date.now();
        highlightNextWord();

        inputField.value = ""; // Clear input field after space
        event.preventDefault(); // Prevent adding extra spaces

        if (currentWordIndex === wordsToType.length) {
            finishTest();
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};
const finishTest = () => {
    clearInterval(timerInterval);
    const totalTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    const formattedTime = minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

    const { wpm, accuracy } = getCurrentStats();

    // Rediriger vers la page resultat.html avec les données dans l'URL
    window.location.href = `resultat.html?temps=${formattedTime}&wpm=${wpm}&accuracy=${accuracy}`;
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();



