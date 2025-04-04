/**
 * Point culture : 
 * Dans ce jeu, un mot équivaut à 5 caractères (espaces inclus).
 * La précision est le pourcentage de caractères corrects sur le total tapés.
 */
// Variables d'état pour le chronométrage et la progression
let startTime = null, previousEndTime = null; // Timers pour le calcul de vitesse
let currentWordIndex = 0; // Index du mot actuel
const wordsToType = []; // Liste des mots à taper

// Références aux éléments HTML
const modeSelect = document.getElementById("mode"); // Sélecteur de difficulté
const wordDisplay = document.getElementById("word-display"); // Zone d'affichage des mots
const inputField = document.getElementById("input-field"); // Champ de saisie utilisateur
const results = document.getElementById("results"); // Affichage des résultats

// Liste des mots par difficulté
const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Génère un mot aléatoire selon la difficulté choisie
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialise le test avec un nombre de mots donné (50 par défaut)
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Réinitialise la liste
    wordDisplay.innerHTML = ""; // Vide l'affichage
    currentWordIndex = 0; // Reset la progression
    startTime = null; // Réinitialise les timers
    previousEndTime = null;

    // Remplit la liste avec des mots aléatoires
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    // Crée l'affichage des mots avec le premier en rouge
    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Mise en évidence premier mot
        wordDisplay.appendChild(span);
    });

    inputField.value = ""; // Réinitialise le champ de saisie
    results.textContent = ""; // Efface les résultats précédents
};

// Démarre le timer au premier appui utilisateur
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calcule les statistiques en temps réel (mots par minute et précision)
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Temps écoulé en secondes
    // Calcul WPM : (nombre de caractères / 5) / (minutes écoulées)
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);
    // Calcul précision : (caractères corrects / total tapés) * 100
    const accuracy = (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Gère le passage au mot suivant avec la barre d'espace
const updateWord = (event) => {
    if (event.key === " ") { // Vérifie si c'est une espace
        if (inputField.value.trim() === wordsToType[currentWordIndex]) { // Si mot correct
            if (!previousEndTime) previousEndTime = startTime;

            // Affiche les stats et passe au mot suivant
            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Précision: ${accuracy}%`;

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Réinitialise le champ
            event.preventDefault(); // Bloque l'espace supplémentaire
        }
    }
};

// Met en évidence le mot actuel en rouge
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black"; // Désactive le précédent
        }
        wordElements[currentWordIndex].style.color = "red"; // Active le nouveau
    }
};

// Événements
inputField.addEventListener("keydown", (event) => {
    startTimer(); // Démarre le timer au premier appui
    updateWord(event); // Vérifie la saisie
});
modeSelect.addEventListener("change", () => startTest()); // Redémarre le test si difficulté changée

// Démarrage initial
startTest();