
// Variables du jeu
let words = [];
let currentWordIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let startTime;
let timer;
let gameDuration = 30;
let isPlaying = false;
let currentDifficulty = 'easy';

// Mots par difficulté
const wordLists = {
    easy: ["pomme", "banane", "fraise", "orange", "kiwi", "fruit", "melon", "pêche", "poire", "raisin"],
    medium: ["clavier", "écran", "souris", "chargeur", "batterie", "portable", "ordinateur", "téléphone", "imprimante", "casque"],
    hard: ["programmation", "développement", "algorithmique", "architecture", "javascript", "ordinateur", "interface", "système", "application", "réseau"]
};

// Éléments DOM
const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const newTestBtn = document.getElementById('new-test');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Initialisation
init();

function init() {
    loadNewText();
    setupEventListeners();
}

function loadNewText() {
    // Sélectionner 10 mots aléatoires de la difficulté actuelle
    const wordList = wordLists[currentDifficulty];
    words = [];
    
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        words.push(wordList[randomIndex]);
    }
    
    currentWordIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    
    renderWords();
    userInput.value = '';
    userInput.focus();
}

function renderWords() {
    textDisplay.innerHTML = '';
    
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.textContent = word;
        
        if (index === currentWordIndex) {
            wordSpan.classList.add('current');
        }
        
        textDisplay.appendChild(wordSpan);
    });
}

function setupEventListeners() {
    userInput.addEventListener('input', handleInput);
    newTestBtn.addEventListener('click', startNewTest);
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
            startNewTest();
        });
    });
}

function handleInput(e) {
    if (!isPlaying) {
        startGame();
    }
    
    const inputValue = e.target.value;
    const currentWord = words[currentWordIndex];
    
    if (inputValue.endsWith(' ')) {
        if (inputValue.trim() === currentWord) {
            correctChars += currentWord.length;
            markWordAsCorrect();
        } else {
            incorrectChars += currentWord.length;
            markWordAsIncorrect();
        }
        
        e.target.value = '';
        currentWordIndex++;
        
        if (currentWordIndex >= words.length) {
            loadNewText();
        } else {
            renderWords();
        }
    } else {
        updateCurrentWordHighlight(inputValue, currentWord);
    }
    
    updateStats();
}

function markWordAsCorrect() {
    const wordElements = document.querySelectorAll('.word');
    if (currentWordIndex < wordElements.length) {
        wordElements[currentWordIndex].classList.add('correct');
        wordElements[currentWordIndex].classList.remove('incorrect');
    }
}

function markWordAsIncorrect() {
    const wordElements = document.querySelectorAll('.word');
    if (currentWordIndex < wordElements.length) {
        wordElements[currentWordIndex].classList.add('incorrect');
        wordElements[currentWordIndex].classList.remove('correct');
    }
}

function updateCurrentWordHighlight(inputValue, currentWord) {
    const wordElements = document.querySelectorAll('.word');
    if (currentWordIndex >= wordElements.length) return;
    
    const currentWordElement = wordElements[currentWordIndex];
    currentWordElement.classList.remove('correct', 'incorrect');
    
    if (inputValue === currentWord.substring(0, inputValue.length)) {
        currentWordElement.classList.add('correct');
    } else {
        currentWordElement.classList.add('incorrect');
    }
}

function startGame() {
    isPlaying = true;
    startTime = new Date();
    
    timer = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const remainingTime = gameDuration - elapsedSeconds;
        
        timeDisplay.textContent = `${remainingTime}s`;
        
        if (elapsedSeconds >= gameDuration) {
            endGame();
        }
        
        updateStats();
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    isPlaying = false;
    userInput.disabled = true;
    updateStats();
}

function updateStats() {
    const currentTime = isPlaying ? new Date() : new Date(startTime.getTime() + gameDuration * 1000);
    const elapsedMinutes = (currentTime - startTime) / 60000;
    
    const wpm = Math.round((correctChars / 5) / elapsedMinutes) || 0;
    wpmDisplay.textContent = wpm;
    
    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    accuracyDisplay.textContent = `${accuracy}%`;
}

function startNewTest() {
    clearInterval(timer);
    isPlaying = false;
    userInput.disabled = false;
    loadNewText();
    
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0%';
    timeDisplay.textContent = `${gameDuration}s`;
}
