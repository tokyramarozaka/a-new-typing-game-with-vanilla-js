let startTime = null, endTime = null;
let currentWordIndex = 0;
let correctChars = 0;
let totalChars = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordCountInput = document.getElementById("word-count");
const startButton = document.getElementById("start-button");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    endTime = null;
    correctChars = 0;
    totalChars = 0;
    results.textContent = "";
    inputField.value = "";
    inputField.disabled = false;
    inputField.focus();

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.innerHTML = word.split('').map(letter => `<span>${letter}</span>`).join('');
        wordSpan.classList.add('word-container');
        wordDisplay.appendChild(wordSpan);
        wordDisplay.appendChild(document.createTextNode(" ")); 
        if (index === 0) wordSpan.classList.add("current-word");
    });
};

const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

const displayResults = () => {
    endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const totalWords = wordsToType.length;
    const wpm = ((correctChars / 5) / (timeTaken / 60)).toFixed(2);
    const accuracy = ((correctChars / totalChars) * 100).toFixed(2);
    results.textContent = `Temps écoulé: ${timeTaken.toFixed(2)} secondes, Mots par minute: ${wpm}, Précision: ${accuracy}%`;
    inputField.disabled = true;
};

const updateWord = (event) => {
    startTimer(); 
    const currentInput = inputField.value;
    const currentWord = wordsToType[currentWordIndex];
    const wordDisplaySpans = wordDisplay.children[currentWordIndex]?.children; 
    if (wordDisplaySpans) {
        for (let i = 0; i < currentWord.length; i++) {
            if (wordDisplaySpans[i]) {
                wordDisplaySpans[i].className = '';
            }
        }
    }

    let allCorrect = true;

    for (let i = 0; i < currentInput.length; i++) {
        if (i < currentWord.length) {
            const span = wordDisplaySpans?.[i];
            if (span) {
                if (currentInput[i] === currentWord[i]) {
                    span.classList.add('correct-char');
                } else {
                    span.classList.add('incorrect-char');
                    allCorrect = false;
                }
            }
        } else {
            allCorrect = false
        }
    }

    if (event.key === " ") {
        if (currentInput.trim() === currentWord) {
            totalChars += currentWord.length + 1; 
            correctChars += currentWord.length;

            const wordElements = wordDisplay.children;
            wordElements[currentWordIndex].classList.remove("current-word");
            wordElements[currentWordIndex].classList.add("completed-correct");
            currentWordIndex++;
            inputField.value = "";

            if (currentWordIndex < wordsToType.length) {
                wordDisplay.children[currentWordIndex].classList.add("current-word");
                const nextWord = wordsToType[currentWordIndex];
                wordDisplay.children[currentWordIndex].innerHTML = nextWord.split('').map(letter => `<span>${letter}</span>`).join('');
            } else {
                displayResults();
            }
        } else {
            const wordElements = wordDisplay.children;
            wordElements[currentWordIndex].classList.remove("current-word");
            wordElements[currentWordIndex].classList.add("completed-incorrect");
            currentWordIndex++;
            inputField.value = "";
            if (currentWordIndex < wordsToType.length) {
                wordDisplay.children[currentWordIndex].classList.add("current-word");
                const nextWord = wordsToType[currentWordIndex];
                wordDisplay.children[currentWordIndex].innerHTML = nextWord.split('').map(letter => `<span>${letter}</span>`).join('');
            } else {
                displayResults();
            }
        }
        event.preventDefault();
    } else {
        if (currentWordIndex < wordDisplay.children.length) {
            wordDisplay.children[currentWordIndex].classList.add("current-word");
        }
    }
};

inputField.addEventListener("input", updateWord);
inputField.removeEventListener("keydown", updateWord); 
inputField.addEventListener("keydown", startTimer); 
inputField.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        updateWord(event); 
    }
});
modeSelect.addEventListener("change", () => startTest(parseInt(wordCountInput.value) || 50));
startButton.addEventListener("click", () => startTest(parseInt(wordCountInput.value) || 50));

const initializeTest = () => {
    const wordCount = parseInt(wordCountInput.value) || 50;
    startTest(wordCount);
};

initializeTest();