const STATS_SETTINGS = {
  THEME_KEY: "typing-theme",
  HISTORY_KEY: "typing-history",
  MAX_CARDS: 6,
  CANVAS_HEIGHT: 420,
  GRID_LINES: 5,
  DEFAULT_MAX_VALUE: 100,
  PADDING: 48,
  DOT_RADIUS: 4,
  DOT_INNER_RADIUS: 2.5,
  LINE_WIDTH: 2.5,
  FILL_ALPHA: "22",
  FONT: "12px Arial",
  LABEL_X_OFFSET: 10,
  LABEL_Y_OFFSET: 4,
  WPM_COLOR: "#38bdf8",
  ACC_COLOR: "#22c55e",
  SCORE_COLOR: "#f59e0b",
  ERRORS_COLOR: "#ef4444",
  GRID_COLOR: "rgba(148,163,184,0.35)",
  DOT_INNER_COLOR: "#0f172a",
  SINGLE_BAR_WIDTH: 60,
  SINGLE_BAR_GAP: 24,
  SINGLE_BAR_LABEL_OFFSET: 14,
  SINGLE_BAR_VALUE_OFFSET: 28,
  LEGEND_Y: 30,
  LEGEND_DOT_SIZE: 8,
  LEGEND_SPACING: 120,
  LEGEND_TEXT_OFFSET: 14,
};

const METRICS = [
  { key: "wpm",    label: "WPM",       color: "#38bdf8", maxKey: null },
  { key: "acc",    label: "Précision", color: "#22c55e", maxKey: null },
  { key: "score",  label: "Score",     color: "#f59e0b", maxKey: null },
  { key: "errors", label: "Erreurs",   color: "#ef4444", maxKey: null },
];

const els = {
  clearStatsBtn: document.querySelector("#clearStatsBtn"),
  historyCards:  document.querySelector("#historyCards"),
  canvas:        document.querySelector("#statsCanvas"),
};

let chartData = [];

const loadTheme = () =>
  localStorage.getItem(STATS_SETTINGS.THEME_KEY) || "dark";

const applyTheme = (theme) =>
  document.documentElement.setAttribute("data-theme", theme);

const getHistory = () =>
  JSON.parse(localStorage.getItem(STATS_SETTINGS.HISTORY_KEY) || "[]");

const createStatCard = (item) => {
  const card = document.createElement("div");
  card.className = "stat";

  const dateSpan = document.createElement("span");
  dateSpan.textContent = item.date;

  const wpmStrong = document.createElement("strong");
  wpmStrong.textContent = `${item.wpm} WPM`;

  const details = document.createElement("div");
  details.textContent = `${item.acc}% | ${item.score} points | ${item.errors} erreurs`;

  card.appendChild(dateSpan);
  card.appendChild(wpmStrong);
  card.appendChild(details);

  return card;
};

const renderCards = (history) => {
  while (els.historyCards.firstChild) {
    els.historyCards.removeChild(els.historyCards.firstChild);
  }

  if (!history.length) {
    const empty = document.createElement("p");
    empty.textContent = "Aucune statistique enregistrée.";
    els.historyCards.appendChild(empty);
    return;
  }

  history.slice(0, STATS_SETTINGS.MAX_CARDS).forEach((item) =>
    els.historyCards.appendChild(createStatCard(item))
  );
};



const drawSingleEntry = (ctx, entry, width, height) => {
  const pad = STATS_SETTINGS.PADDING;
  const barW = STATS_SETTINGS.SINGLE_BAR_WIDTH;
  const gap = STATS_SETTINGS.SINGLE_BAR_GAP;
  const totalW = METRICS.length * barW + (METRICS.length - 1) * gap;
  const startX = (width - totalW) / 2;
  const graphH = height - pad * 2;
  const bottomY = pad + graphH;

  const values = METRICS.map(({ key }) => entry[key] ?? 0);
  const maxVal = Math.max(STATS_SETTINGS.DEFAULT_MAX_VALUE, ...values);


  ctx.font = STATS_SETTINGS.FONT;
  ctx.strokeStyle = STATS_SETTINGS.GRID_COLOR;
  ctx.lineWidth = 1;
  ctx.fillStyle =
    getComputedStyle(document.documentElement).getPropertyValue("--text") ||
    "#e5e7eb";

  for (let i = 0; i <= STATS_SETTINGS.GRID_LINES; i++) {
    const y = pad + (graphH / STATS_SETTINGS.GRID_LINES) * i;
    const label = Math.round(maxVal - (maxVal / STATS_SETTINGS.GRID_LINES) * i);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
    ctx.fillText(String(label), STATS_SETTINGS.LABEL_X_OFFSET, y + STATS_SETTINGS.LABEL_Y_OFFSET);
  }


  METRICS.forEach(({ key, label, color }, i) => {
    const value = entry[key] ?? 0;
    const barH = (value / maxVal) * graphH;
    const x = startX + i * (barW + gap);
    const y = bottomY - barH;

   
    ctx.fillStyle = color + "55";
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 6);
    ctx.fill();


    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 6);
    ctx.stroke();


    ctx.fillStyle = color;
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.fillText(String(value), x + barW / 2, y - STATS_SETTINGS.SINGLE_BAR_VALUE_OFFSET);


    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--text") ||
      "#e5e7eb";
    ctx.font = STATS_SETTINGS.FONT;
    ctx.fillText(label, x + barW / 2, bottomY + STATS_SETTINGS.SINGLE_BAR_LABEL_OFFSET);
  });
};



const computePoints = (values, graphW, graphH, pad, maxVal) =>
  values.map((value, index) => ({
    x: pad + (graphW / (values.length - 1)) * index,
    y: pad + graphH - (value / maxVal) * graphH,
  }));

const drawCurvedFill = (ctx, points, color, bottomY) => {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, bottomY);
  ctx.lineTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
  }

  ctx.lineTo(points[points.length - 1].x, bottomY);
  ctx.closePath();
  ctx.fillStyle = color + STATS_SETTINGS.FILL_ALPHA;
  ctx.fill();
};

const drawCurvedLine = (ctx, points, color) => {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = STATS_SETTINGS.LINE_WIDTH;
  ctx.stroke();
};

const drawDots = (ctx, points, color) => {
  points.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, STATS_SETTINGS.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, STATS_SETTINGS.DOT_INNER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = STATS_SETTINGS.DOT_INNER_COLOR;
    ctx.fill();
  });
};

const drawCurve = (ctx, points, color, bottomY) => {
  if (!points.length) return;
  drawCurvedFill(ctx, points, color, bottomY);
  drawCurvedLine(ctx, points, color);
  drawDots(ctx, points, color);
};

const drawLegend = (ctx, width) => {
  const totalW = METRICS.length * STATS_SETTINGS.LEGEND_SPACING;
  const startX = (width - totalW) / 2;

  METRICS.forEach(({ label, color }, i) => {
    const x = startX + i * STATS_SETTINGS.LEGEND_SPACING;
    const y = STATS_SETTINGS.LEGEND_Y;

    ctx.beginPath();
    ctx.arc(x, y, STATS_SETTINGS.LEGEND_DOT_SIZE / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--text") ||
      "#e5e7eb";
    ctx.font = STATS_SETTINGS.FONT;
    ctx.textAlign = "left";
    ctx.fillText(label, x + STATS_SETTINGS.LEGEND_TEXT_OFFSET, y + 4);
  });
};

const drawGrid = (ctx, width, graphH, pad, maxVal) => {
  ctx.strokeStyle = STATS_SETTINGS.GRID_COLOR;
  ctx.lineWidth = 1;
  ctx.font = STATS_SETTINGS.FONT;
  ctx.textAlign = "left";
  ctx.fillStyle =
    getComputedStyle(document.documentElement).getPropertyValue("--text") ||
    "#e5e7eb";

  for (let i = 0; i <= STATS_SETTINGS.GRID_LINES; i++) {
    const y = pad + (graphH / STATS_SETTINGS.GRID_LINES) * i;
    const label = Math.round(maxVal - (maxVal / STATS_SETTINGS.GRID_LINES) * i);

    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();

    ctx.fillText(
      String(label),
      STATS_SETTINGS.LABEL_X_OFFSET,
      y + STATS_SETTINGS.LABEL_Y_OFFSET
    );
  }
};

const drawChart = (history) => {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.offsetWidth || canvas.parentElement.offsetWidth || 800;
  const height = STATS_SETTINGS.CANVAS_HEIGHT;
  const pad = STATS_SETTINGS.PADDING;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  if (!history.length) {
    ctx.font = STATS_SETTINGS.FONT;
    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--text") ||
      "#e5e7eb";
    ctx.fillText("Aucune donnée", pad, height / 2);
    return;
  }


  if (history.length === 1) {
    drawSingleEntry(ctx, history[0], width, height);
    return;
  }


  const graphW = width - pad * 2;
  const graphH = height - pad * 2;
  const bottomY = pad + graphH;

  const reversed = history.slice().reverse();

  const allValues = METRICS.flatMap(({ key }) => reversed.map((h) => h[key] ?? 0));
  const maxVal = Math.max(STATS_SETTINGS.DEFAULT_MAX_VALUE, ...allValues);

  drawGrid(ctx, width, graphH, pad, maxVal);
  drawLegend(ctx, width);

  METRICS.forEach(({ key, color }) => {
    drawCurve(
      ctx,
      computePoints(reversed.map((h) => h[key] ?? 0), graphW, graphH, pad, maxVal),
      color,
      bottomY
    );
  });
};

const refreshStats = () => {
  chartData = getHistory();
  renderCards(chartData);
  drawChart(chartData);
};

els.clearStatsBtn.addEventListener("click", () => {
  localStorage.removeItem(STATS_SETTINGS.HISTORY_KEY);
  refreshStats();
});

window.addEventListener("resize", () => drawChart(chartData));

window.addEventListener("load", () => {
  applyTheme(loadTheme());
  refreshStats();
});