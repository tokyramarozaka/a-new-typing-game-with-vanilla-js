const wordsDataset = {
    easy: ["apple", "banana", "grape", "orange", "cherry", "melon", "peach", "plum", "mango", "lemon", "active", "brave", "clear", "drive", "early", "flight", "green", "happy", "image", "juice"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery", "desktop", "scanner", "speaker", "network", "storage", "javascript", "interface", "component", "database", "function"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "acknowledge", "infrastructure", "phenomenon", "circumstance", "revolutionary", "anachronism", "juxtaposition"]
};

let currentMode = "easy";
let wordsToType = [];
let totalTimeLimit = 60;
let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let isTestActive = true;

let totalKeystrokes = 0;
let correctKeystrokes = 0;
let historiqueWPM = []; 


let lettersArray = []; 
let currentLetterIndex = 0;


const textDactylo = document.getElementById("text-dactylo");
const selectTime = document.getElementById("time");
const difficultyButtons = document.querySelectorAll(".section-option-right button");

const wpmDisplay = document.querySelector(".section-score-left h2");
const precisionDisplay = document.querySelector(".section-score-middle h2");
const timerDisplay = document.querySelector(".section-score-right h2");

// Input fantôme pour PC et mobile
const hiddenInput = document.createElement("input");
hiddenInput.type = "text";
hiddenInput.style.position = "absolute";
hiddenInput.style.opacity = "0";
hiddenInput.style.pointerEvents = "none";
document.body.appendChild(hiddenInput);


const generateWordsList = () => {
    const dataset = wordsDataset[currentMode];
    let temporaryList = [];

    for (let i = 0; i < 40; i++) {
        const randomIndex = Math.floor(Math.random() * dataset.length);
        temporaryList.push(dataset[randomIndex]);
    }

    return temporaryList;
};

const initTest = () => {
    clearInterval(timerInterval);
    textDactylo.innerHTML = "";
    lettersArray = [];
    currentLetterIndex = 0;
    startTime = null;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    historiqueWPM = []; 
    isTestActive = true;
    
    hiddenInput.value = "";
    hiddenInput.disabled = false;

    totalTimeLimit = parseInt(selectTime.value) || 60;
    timeLeft = totalTimeLimit;
    timerDisplay.textContent = formatTime(timeLeft);
    wpmDisplay.textContent = "00";
    precisionDisplay.textContent = "00%";

    wordsToType = generateWordsList();

    wordsToType.forEach((word, wordIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("word-wrapper");

        for (let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement("span");
            letterSpan.textContent = word[i];
            letterSpan.classList.add("letter");
            wordSpan.appendChild(letterSpan);
            lettersArray.push(letterSpan);
        }

        if (wordIdx < wordsToType.length - 1) {
            const spaceSpan = document.createElement("span");
            spaceSpan.textContent = " ";
            spaceSpan.style.display = "none";
            wordSpan.appendChild(spaceSpan);
            lettersArray.push(spaceSpan);
        }

        textDactylo.appendChild(wordSpan);
    });

    if (lettersArray.length > 0) {
        lettersArray[0].classList.add("cursor-active");
    }

    hiddenInput.focus();
};

const startTimer = () => {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        
        updateScores();

        const actuelWPM = parseInt(wpmDisplay.textContent) || 0;
        historiqueWPM.push(actuelWPM);

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
};

hiddenInput.addEventListener("input", (e) => {
    if (!isTestActive) return;

    if (!startTime) {
        startTimer();
    }

    const inputValue = hiddenInput.value;
    const currentTargetLetter = lettersArray[currentLetterIndex];

    if (!currentTargetLetter) return;

    totalKeystrokes++;
    const lastTypedChar = inputValue.charAt(inputValue.length - 1);


    if (lastTypedChar === currentTargetLetter.textContent) {
        currentTargetLetter.classList.remove("cursor-active");
        currentTargetLetter.classList.add("char-valid");
        correctKeystrokes++;
        currentLetterIndex++;
    } 
    
    else {
        currentTargetLetter.classList.remove("cursor-active");
        currentTargetLetter.classList.add("char-invalid");
        currentLetterIndex++;
    }

    if (currentLetterIndex < lettersArray.length) {
        lettersArray[currentLetterIndex].classList.add("cursor-active");
    } 
    
    else {
        endTest(); 
    }

    hiddenInput.value = "";
    updateScores();
});

window.addEventListener("keydown", (e) => {
    if (!isTestActive) return;
    
    if (e.key === "Backspace" && currentLetterIndex > 0) {
        lettersArray[currentLetterIndex]?.classList.remove("cursor-active");
        
        currentLetterIndex--;
        const letter = lettersArray[currentLetterIndex];
        letter.classList.remove("char-valid", "char-invalid");
        letter.classList.add("cursor-active");
    }
});

document.addEventListener("click", () => {
    if (isTestActive) hiddenInput.focus();
});

const updateScores = () => {
    if (!startTime) return;
    
    const elapsedTimeInMinutes = (Date.now() - startTime) / 1000 / 60;

    if (elapsedTimeInMinutes > 0) {
        const wpm = (correctKeystrokes / 5) / elapsedTimeInMinutes;
        wpmDisplay.textContent = Math.round(wpm).toString().padStart(2, '0');
    }

    const accuracy = totalKeystrokes > 0 ? (correctKeystrokes / totalKeystrokes) * 100 : 0;
    precisionDisplay.textContent = `${Math.round(accuracy).toString().padStart(2, '0')}%`;
};

const endTest = () => {
    clearInterval(timerInterval);
    isTestActive = false;
    hiddenInput.disabled = true;

    if (lettersArray[currentLetterIndex]) {
        lettersArray[currentLetterIndex].classList.remove("cursor-active");
    }

    localStorage.setItem("dernierWPM", wpmDisplay.textContent);
    localStorage.setItem("dernierePrecision", precisionDisplay.textContent);
    
    const totalErreurs = document.querySelectorAll('.char-invalid').length;
    localStorage.setItem("dernierErreurs", totalErreurs);

    localStorage.setItem("historiqueWPM", JSON.stringify(historiqueWPM));

    setTimeout(() => {
        window.location.href = "result.html";
    }, 1500);
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

selectTime.addEventListener("change", initTest);

difficultyButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        difficultyButtons.forEach(b => b.removeAttribute("id"));
        e.target.id = "level-actual";

        const text = e.target.textContent.trim();
        if (text === "Amateur") currentMode = "easy";
        if (text === "Intermédiaire") currentMode = "medium";
        if (text === "Hardcore") currentMode = "hard";

        initTest();
    });
});

initTest();