document.addEventListener("DOMContentLoaded", () => {
    let donnéesWPM = JSON.parse(localStorage.getItem("historiqueWPM")) || [45, 52, 58, 62, 65, 61, 68, 74, 72, 82];
    let secondes = donnéesWPM.map((_, index) => `${index + 1}s`);

    // Affichage des totaux finaux dans la section de gauche
    const wpmAffichage = document.querySelector(".section-result-left-top h1");
    const precisionAffichage = document.querySelector(".section-result-left-middle1 h3");
    
    if(localStorage.getItem("dernierWPM")) {
        wpmAffichage.textContent = localStorage.getItem("dernierWPM");
    } else {
        wpmAffichage.textContent = donnéesWPM[donnéesWPM.length - 1];
    }

    if(localStorage.getItem("dernierePrecision")) {
        precisionAffichage.textContent = localStorage.getItem("dernierePrecision");
    } else {
        precisionAffichage.textContent = "00%";
    }


    const ctx = document.getElementById("progressionChart").getContext("2d");
    const dégradéFond = ctx.createLinearGradient(0, 0, 0, 300);
    dégradéFond.addColorStop(0, "rgba(0, 245, 212, 0.2)"); 
    dégradéFond.addColorStop(1, "rgba(251, 255, 0, 0.0)");  

    const configurationChart = {
        type: 'line',
        data: {
            labels: secondes, 
            datasets: [{
                label: 'Mots par minute',
                data: donnéesWPM, 
                borderColor: '#00F5D4', 
                borderWidth: 3,
                pointBackgroundColor: '#fbff00', 
                pointBorderColor: '#00F5D4',
                pointHoverRadius: 7,
                pointRadius: 4,
                tension: 0.35, 
                fill: true,
                backgroundColor: dégradéFond, 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false 
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(117, 117, 117, 0.1)' 
                    },
                    ticks: {
                        color: '#969696', 
                        font: { family: 'Segoe UI' }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(117, 117, 117, 0.1)'
                    },
                    ticks: {
                        color: '#969696',
                        font: { family: 'Segoe UI' },
                        beginAtZero: true
                    }
                }
            }
        }
    };

    
    const monGraphique = new Chart(ctx, configurationChart);
    const boutonRecommencer = document.getElementById("section-result-left-bottom");
    const relancerTest = () => {
        window.location.href = "index.html";
    };

    boutonRecommencer.addEventListener("click", relancerTest);

    window.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            relancerTest();
        }
    });
});