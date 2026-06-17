const NB_COLONNES = 3;
const RATIO_TUILE = 0.18;
const MOT_VITESSE_DEPART = 0.8;
const MOT_VITESSE_GAIN = 0.15;
const PALIER = 5;
const SPAWN_MAX_MS = 2500;
const SPAWN_MIN_MS = 1000;
const SPAWN_REDUCTION = 25;
const NB_PARTICULES = 12;
const NB_ETOILES = 60;
const COULEURS_COLONNES = [
  { neon: '#00e5ff', fond: 'rgba(0,229,255,.3)' },
  { neon: '#ff4d6d', fond: 'rgba(255,77,109,.3)' },
  { neon: '#00ffcc', fond: 'rgba(0,255,204,.3)' },
];
const COULEURS_PARTICULES = ['#00e5ff', '#ff4d6d', '#00ffcc', '#f5c518', '#ffffff'];
const NOTES = [
  [440, 0.4], [494, 0.4], [554, 0.4], [659, 0.4], [554, 0.4], [494, 0.4],
  [370, 0.4], [415, 0.4], [440, 0.4], [494, 0.4], [440, 0.4], [415, 0.4],
  [330, 0.4], [370, 0.4], [415, 0.4], [494, 0.4], [415, 0.4], [370, 0.4],
  [311, 0.4], [330, 0.4], [370, 0.4], [440, 0.4], [370, 0.4], [330, 0.4],
  [440, 0.4], [554, 0.4], [659, 0.4], [880, 0.5], [659, 0.4], [554, 0.6],
];
const MOTS = [
  'piano','notes','tempo','gamme',
  'fugue','basse','jazz','rock',
  'loop','funk','soul','clave',
  'solo','trio','radio','cycle'
];
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
const meilleurEl = document.querySelector('#meilleur');
const vitesseEl = document.querySelector('#vitesse');
const ecran = document.querySelector('#ecran');
const ecranStats = document.querySelector('#ecran-stats');
const btnJouer = document.querySelector('#btn-jouer');
const btnRejouer = document.querySelector('#btn-rejouer');
const champ = document.querySelector('#champ');
const statScore = document.querySelector('#stat-score');
const statMots = document.querySelector('#stat-mots');
const statLettres = document.querySelector('#stat-lettres');
const statPrecision = document.querySelector('#stat-precision');
const statWpm = document.querySelector('#stat-wpm');
const statNiveau = document.querySelector('#stat-niveau');
const barreRemplie = document.querySelector('#barre-remplie');
let enJeu = false;
let score = 0;
let meilleur = 0;
let vitesseMots = MOT_VITESSE_DEPART;
let tempsAnim = 0;
let dernierTs = 0;
let nbMotsDetruits = 0;
let nbLettresTapees = 0;
let nbLettresRatees = 0;
let tempsDepart = 0;
let audio = null;
let reverb = null;
let indexNote = 0;
let mots = [];
let motCible = null;
let dernierSpawn = 0;
let etoiles = [];
let modeLight = false;

function demarrerAudio() {
  if (audio) {
    return;
  }
  audio = new AudioContext();
  reverb = creerReverb();
}

function creerReverb() {
  const duree = 2;
  const nbEch = audio.sampleRate * duree;
  const buf = audio.createBuffer(2, nbEch, audio.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < nbEch; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nbEch, 3);
    }
  }

  const conv = audio.createConvolver();
  conv.buffer = buf;
  const entree = audio.createGain();
  const sec = audio.createGain();
  sec.gain.value = 0.7;
  const rev = audio.createGain();
  rev.gain.value = 0.3;
  entree.connect(sec);
  entree.connect(conv);
  conv.connect(rev);
  sec.connect(audio.destination);
  rev.connect(audio.destination);
  return entree;
}

function jouerNote() {
  const freq = NOTES[indexNote % NOTES.length][0];
  const duree = NOTES[indexNote % NOTES.length][1];
  indexNote++;

  const quand = audio.currentTime;
  const maitre = audio.createGain();
  maitre.connect(reverb);
  maitre.gain.setValueAtTime(0, quand);
  maitre.gain.linearRampToValueAtTime(0.35, quand + 0.01);
  maitre.gain.exponentialRampToValueAtTime(0.15, quand + 0.3);
  maitre.gain.exponentialRampToValueAtTime(0.001, quand + duree + 0.5);

  const harmons = [[1, 1], [2, .5], [3, .25], [4, .12]];
  for (let i = 0; i < harmons.length; i++) {
    const mul = harmons[i][0];
    const vol = harmons[i][1];
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * mul;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(maitre);
    osc.start(quand);
    osc.stop(quand + duree + 0.5);
  }
}

function lTuile() {
  return canvas.width / NB_COLONNES;
}

function hTuile() {
  return canvas.height * RATIO_TUILE;
}

function redimensionner() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function dessinerFond() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#050d12');
  g.addColorStop(0.5, '#030a0f');
  g.addColorStop(1, '#050d12');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function dessinerEtoiles() {
  for (let i = 0; i < etoiles.length; i++) {
    const e = etoiles[i];
    e.y += e.vit;
    if (e.y > canvas.height) {
      e.y = -2;
      e.x = Math.random() * canvas.width;
    }
    ctx.globalAlpha = e.alpha * (0.6 + 0.4 * Math.sin(tempsAnim * 0.001 + e.x));
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function dessinerLigneDanger() {
  const yD = canvas.height - 50;
  ctx.strokeStyle = 'rgba(244,63,94,.5)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(0, yD);
  ctx.lineTo(canvas.width, yD);
  ctx.stroke();
  ctx.setLineDash([]);
  const g = ctx.createLinearGradient(0, yD, 0, canvas.height);
  g.addColorStop(0, 'rgba(244,63,94,.15)');
  g.addColorStop(1, 'rgba(244,63,94,.05)');
  ctx.fillStyle = g;
  ctx.fillRect(0, yD, canvas.width, canvas.height - yD);
}

function initialiserJeu() {
  mots = [];
  motCible = null;
  vitesseMots = MOT_VITESSE_DEPART;
  champ.value = '';
  etoiles = [];
  for (let i = 0; i < NB_ETOILES; i++) {
    etoiles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.3 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.5,
      vit: 0.1 + Math.random() * 0.3,
    });
  }
  nbMotsDetruits = 0;
  nbLettresTapees = 0;
  nbLettresRatees = 0;
  tempsDepart = performance.now();
}

function spawnMot() {
  const marge = 40;
  const mot = {
    texte: MOTS[Math.floor(Math.random() * MOTS.length)],
    x: marge + Math.random() * (canvas.width - marge * 2),
    y: -20,
    frappe: 0,
    id: Math.random(),
  };
  mots.push(mot);
}

function delaiSpawn() {
  const modeSel = document.querySelector('#pianoModeSel');
  const mode = modeSel ? modeSel.value : 'normal';
  let base = SPAWN_MAX_MS;
  if (mode === 'fast') {
    base = 1800;
  }
  if (mode === 'zen') {
    base = 3200;
  }
  if (mode === 'arcade') {
    base = 1400;
  }
  
  const delai = base - score * SPAWN_REDUCTION;
  if (delai < SPAWN_MIN_MS) {
    return SPAWN_MIN_MS;
  }
  return delai;
}

function dessinerRoundRect(x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function dessinerUnMot(mot) {
  let estCible = false;
  if (motCible) {
    estCible = mot.id === motCible.id;
  }

  const taille = Math.max(14, canvas.width * 0.044);
  const padX = canvas.width * 0.04;
  const hCarte = canvas.height * 0.06;
  ctx.font = '700 ' + taille + 'px \'Orbitron\', sans-serif';
  const lw = ctx.measureText(mot.texte).width;
  const lc = lw + padX;
  if (estCible) {
    ctx.shadowColor = '#f5c518';
    ctx.shadowBlur = 22;
  }

  const g = ctx.createLinearGradient(mot.x - lc / 2, mot.y, mot.x + lc / 2, mot.y + hCarte);
  if (estCible) {
    g.addColorStop(0, 'rgba(35,28,0,.97)');
    g.addColorStop(1, 'rgba(22,18,0,.97)');
  } else {
    g.addColorStop(0, 'rgba(5,13,18,.92)');
    g.addColorStop(1, 'rgba(3,9,14,.92)');
  }
  ctx.fillStyle = g;
  if (estCible) {
    ctx.strokeStyle = '#f5c518';
    ctx.lineWidth = 1.8;
  } else {
    ctx.strokeStyle = 'rgba(0,229,255,.3)';
    ctx.lineWidth = 1;
  }
  ctx.beginPath();
  dessinerRoundRect(mot.x - lc / 2, mot.y - hCarte / 2, lc, hCarte, 8);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.textBaseline = 'middle';
  let posX = mot.x - lw / 2;
  for (let i = 0; i < mot.texte.length; i++) {
    const l = mot.texte[i];
    if (i < mot.frappe) {
      ctx.fillStyle = '#f5c518';
      ctx.shadowColor = '#f5c518';
      ctx.shadowBlur = 8;
    } else if (estCible && i === mot.frappe) {
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
    } else {
      if (estCible) {
        ctx.fillStyle = '#1a5060';
      } else {
        ctx.fillStyle = 'rgba(0,100,130,.6)';
      }
      ctx.shadowBlur = 0;
    }
    ctx.fillText(l, posX, mot.y);
    posX += ctx.measureText(l).width;
  }
  ctx.shadowBlur = 0;
}

function dessinerScene() {
  dessinerFond();
  dessinerEtoiles();
  dessinerLigneDanger();
  for (let i = 0; i < mots.length; i++) {
    dessinerUnMot(mots[i]);
  }
}

function boucle(ts) {
  if (!enJeu) {
    return;
  }

  let delta = ts - dernierTs;
  if (delta > 50) {
    delta = 50;
  }
  dernierTs = ts;
  tempsAnim += delta;

  const delai = delaiSpawn();
  if (ts - dernierSpawn > delai) {
    spawnMot();
    dernierSpawn = ts;
  }
  for (let i = 0; i < mots.length; i++) {
    mots[i].y += vitesseMots * (delta / 16);
  }
  for (let i = 0; i < mots.length; i++) {
    if (mots[i].y > canvas.height - 20) {
      gameOver();
      return;
    }
  }
  dessinerScene();
  requestAnimationFrame(boucle);
}

function gererFrappe(lettre) {
  if (!enJeu) {
    return;
  }
  lettre = lettre.toLowerCase();
  if (!lettre) {
    return;
  }
  if (!motCible) {
    motCible = null;
    for (let i = 0; i < mots.length; i++) {
      if (mots[i].texte[0] === lettre) {
        motCible = mots[i];
        break;
      }
    }
  }
  if (!motCible) {
    nbLettresRatees++;
    return;
  }
  if (lettre !== motCible.texte[motCible.frappe]) {
    nbLettresRatees++;
    return;
  }
  jouerNote();
  nbLettresTapees++;
  motCible.frappe++;
  if (motCible.frappe >= motCible.texte.length) {
    motDetruit();
    champ.value = '';
  }
}

function motDetruit() {
  if (!motCible) {
    return;
  }
  nbMotsDetruits++;
  exploserDOM(motCible.x, motCible.y);

  const idMot = motCible.id;
  const nouveauxMots = [];
  for (let i = 0; i < mots.length; i++) {
    if (mots[i].id !== idMot) {
      nouveauxMots.push(mots[i]);
    }
  }
  mots = nouveauxMots;
  motCible = null;
  ajouterPoint();
  vitesseMots = MOT_VITESSE_DEPART + Math.floor(score / PALIER) * MOT_VITESSE_GAIN;
}

function exploserDOM(xCanvas, yCanvas) {
  const rect = canvas.getBoundingClientRect();
  const absX = rect.left + xCanvas * (rect.width / canvas.width);
  const absY = rect.top + yCanvas * (rect.height / canvas.height);

  for (let i = 0; i < NB_PARTICULES; i++) {
    const angle = (Math.PI * 2 / NB_PARTICULES) * i + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
    const taille = 4 + Math.random() * 5;
    const coul = COULEURS_PARTICULES[i % COULEURS_PARTICULES.length];
    const p = document.createElement('div');
    p.className = 'particule';
    p.style.left = absX + 'px';
    p.style.top = absY + 'px';
    p.style.width = taille + 'px';
    p.style.height = taille + 'px';
    p.style.background = coul;
    p.style.boxShadow = '0 0 6px ' + coul;
    p.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
    p.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
    document.body.appendChild(p);
    setTimeout(function () {
      p.remove();
    }, 700);
  }
}

function ajouterPoint() {
  score++;
  scoreEl.textContent = score;
  const vitesse = Math.floor(score / PALIER) + 1;
  vitesseEl.textContent = vitesse + 'x';
  animer(scoreEl);
  animer(vitesseEl);
}

function animer(el) {
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

function gameOver() {
  enJeu = false;
  if (score > meilleur) {
    meilleur = score;
    meilleurEl.textContent = meilleur;
    animer(meilleurEl);
  }
  afficherStats();
}

function afficherStats() {
  const totalLettres = nbLettresTapees + nbLettresRatees;
  let precision = 0;
  if (totalLettres > 0) {
    precision = Math.round((nbLettresTapees / totalLettres) * 100);
  }

  const dureeMin = (performance.now() - tempsDepart) / 60000;
  let wpm = 0;
  if (dureeMin > 0) {
    wpm = Math.round(nbMotsDetruits / dureeMin);
  }

  const niveau = Math.floor(score / PALIER) + 1;

  statScore.textContent = score;
  statMots.textContent = nbMotsDetruits;
  statLettres.textContent = nbLettresTapees;
  statPrecision.textContent = precision + '%';
  statWpm.textContent = wpm;
  statNiveau.textContent = niveau;

  const resumeEl = document.querySelector('#resume-stats');
  if (resumeEl) {
    resumeEl.textContent = texteResume(precision, wpm);
  }
  ecranStats.style.display = 'flex';
  setTimeout(function () {
    barreRemplie.style.width = precision + '%';
  }, 100);
}

function texteResume(precision, wpm) {
  if (precision >= 90) {
    return 'Très propre : ' + precision + '% de précision et ' + wpm + ' WPM.';
  }
  if (precision >= 75) {
    return 'Bon résultat : ' + precision + '% de précision et ' + wpm + ' WPM.';
  }
  return 'À améliorer : ' + precision + '% de précision et ' + wpm + ' WPM.';
}

function demarrer() {
  demarrerAudio();
  score = 0;
  indexNote = 0;
  scoreEl.textContent = '0';
  vitesseEl.textContent = '1x';
  ecran.style.display = 'none';
  ecranStats.style.display = 'none';
  enJeu = true;
  tempsAnim = 0;
  dernierTs = performance.now();
  dernierSpawn = performance.now();
  initialiserJeu();
  requestAnimationFrame(boucle);
  setTimeout(function () {
    champ.focus();
  }, 100);
}

btnJouer.addEventListener('click', demarrer);
btnRejouer.addEventListener('click', demarrer);

champ.addEventListener('input', function () {
  if (!enJeu) {
    champ.value = '';
    return;
  }

  const motTape = champ.value.toLowerCase().trim();
  if (!motTape) {
    return;
  }

  const derniereLettre = motTape[motTape.length - 1];
  gererFrappe(derniereLettre);
});

window.addEventListener('resize', function () {
  redimensionner();
  dessinerScene();
});

redimensionner();
dessinerFond();

document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    if (enJeu) {
      return;
    }
    if (ecran.style.display !== 'none') {
      demarrer();
      return;
    }
    if (ecranStats.style.display === 'flex') {
      demarrer();
      return;
    }
  }
});

const btnTheme = document.querySelector('#btn-theme');
btnTheme.addEventListener('click', function () {
  modeLight = !modeLight;
  if (modeLight) {
    document.body.classList.add('light-mode');
    btnTheme.textContent = '☀️';
  } else {
    document.body.classList.remove('light-mode');
    btnTheme.textContent = '🌙';
  }
});

const pianoModeSel = document.querySelector('#pianoModeSel');
if (pianoModeSel) {
  pianoModeSel.addEventListener('change', function() {
    if (enJeu) demarrer();
  });
}