const params = new URLSearchParams(window.location.search);
let temps = params.get("temps");
let wpm = params.get("wpm");
let accuracy = params.get("accuracy");

document.getElementById("temps").textContent = ` Temps utilisé : ${temps}`;
document.getElementById("wpm").textContent = ` Précision : ${wpm}`;
document.getElementById("accuracy").textContent = ` Vitesse brute : : ${accuracy}%`;

const urlParams = new URLSearchParams(window.location.search);
 temps = urlParams.get("temps");
 wpm = urlParams.get("wpm");
 accuracy = urlParams.get("accuracy");

// Affiche les données dans les bons éléments
document.getElementById("temps").textContent = `Temps total : ${temps}`;
document.getElementById("wpm").textContent = ` Vitesse (WPM) : ${wpm}`;
document.getElementById("accuracy").textContent = ` Précision : ${accuracy}%`;
// Fonction pour afficher la remarque
const afficherRemarque = (wpm, accuracy) => {
    const remarque = document.getElementById("remarque");
    if (!remarque) return;

    wpm = parseFloat(wpm);
    accuracy = parseFloat(accuracy);
    let message = "";

    if (wpm >= 60 && accuracy >= 95) {
        message = "🚀 Excellent travail ! Tu es un vrai(e) pro du clavier !";
    } else if (wpm >= 40 && accuracy >= 85) {
        message = "👏 Très bon résultat ! Encore un petit effort pour atteindre l'excellence.";
    } else if (wpm >= 30 && accuracy >= 75) {
        message = "👍 Pas mal ! Tu progresses bien, continue à t’entraîner.";
    } else if (wpm < 30 && accuracy >= 60) {
        message = "📈 Tu es sur la bonne voie, mais tu peux aller plus vite !";
    } else {
        message = "💡 Continue à t’entraîner, la pratique rend parfait !";
    }

    remarque.textContent = message;
};

// Appel de la fonction avec les valeurs récupérées
afficherRemarque(wpm, accuracy);