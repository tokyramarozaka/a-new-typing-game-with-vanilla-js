/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentCharIndex = 0;
let wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const results = document.getElementById("results");
const firstPage = document.getElementsByClassName('select')[0];
const selectTime = document.getElementById('selectTime');
const timerDisplay = document.getElementById("timer");
let stop = 1
let hasStarted = false;
let hasStoped = false;




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
let time;
let correctLetter = 0;
let incorrectLetter = 0;
let timerInterval = null;

clearInterval(timerInterval);
wordDisplay.style.display = 'none';

const startTest = () => {
    clearInterval(timerInterval);
    stop = 1
    time = selectTime.value;
    correctLetter = 0;
    incorrectLetter = 0;
    hasStarted = false;
    hasStoped = false;
    timerDisplay.textContent = "Temps : " + time + "s";
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    startTime = null;

    wordtest();
    firstPage.style.display = 'none'

    wordDisplay.style.display = 'block';
    wordDisplay.children[0].classList.add("cursor");
    return time;
};

const wordtest = (wordCount = 50) => {

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        for (let i = 0; i < word.length; i++) {
            const span = document.createElement("span");
            span.textContent = word[i];
            span.classList.add("letter");
            wordDisplay.appendChild(span);
        }

        const space = document.createElement("span");
        space.textContent = " ";
        space.classList.add("letter");
        wordDisplay.appendChild(space);

    });

    wordDisplay.value = "";
    results.textContent = "";
}

// Start the timer
let endTime;
const counDown = () => {
    timerInterval = setInterval(() => {
        if (time > 0) {
            time--;
            timerDisplay.textContent = `Temps : ${time}s`;
        }
        else {
            if (!hasStoped) {
                endTime = Date.now();
                hasStoped = true;
            }
            finish();
        }
    }, 1000);
    return a = 0;
}



// Move to the next letter after touching a letter on the keyboard


document.addEventListener("keydown", (event) => {
    // if (!startTime) startTime = Date.now();
    if (hasStoped == true) return;
    if (!hasStarted) {
        startTime = Date.now();
        hasStarted = true;
    }

    const letters = document.getElementsByClassName('letter');
    if (currentCharIndex >= letters.length) return;

    const currentSpan = letters[currentCharIndex];
    const expectedChar = currentSpan.textContent;

    if (event.key.length === 1 || event.key === " ") {
        if (event.key === expectedChar) {
            currentSpan.style.color = 'green';
            correctLetter++;
        }
        else {
            currentSpan.style.color = 'red';
            incorrectLetter++;
        }

        if (stop === 1) {
            counDown();
            stop--;

        }

        currentSpan.classList.remove("cursor");

        currentCharIndex++;


        if (currentCharIndex < letters.length) {
            letters[currentCharIndex].classList.add("cursor");
        }

        if (currentCharIndex + 50 >= letters.length) {
            wordtest();
        }
    } else if (event.key === "Backspace") {
        if (currentCharIndex > 0) {
            if ((letters[currentCharIndex - 1]).style.color == "red") {
                letters[currentCharIndex].classList.remove("cursor");
                currentCharIndex--;
                letters[currentCharIndex].style.color = "";
                letters[currentCharIndex].classList.add("cursor");
            }
        }
    }


})

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    let totalTaped = correctLetter + incorrectLetter
    const elapsedTime = (endTime - startTime) / 1000; // Seconds
    const wpm = (correctLetter / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = (correctLetter / totalTaped) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// finish test
const finish = () => {
    firstPage.style.display = 'flex';
    const { wpm, accuracy } = getCurrentStats();
    results.textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
    // alert(endTime - startTime);
    wordDisplay.style.display = 'none';
    wordsToType = [];
    currentCharIndex = 0;
    timerDisplay.textContent = ""
}
// ---------------------------------------------------------------------------------------------------------------------------------//

// Highlight the current word in red

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
// document.addEventListener("keydown", (event) => {
//     // console.log(event.key)
//     // startTimer();
//     updateWord(event);
// });
modeSelect.addEventListener("change", () => startTest());

// Start the test
// startTest();


// Finish the test
// finichTest()

