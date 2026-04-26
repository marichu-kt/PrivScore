import { buildFrontendDetailUrl, DEFAULT_FRONTEND_BASE_URL } from "../shared/frontend_link.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const btnTextEl = analyzeBtn.querySelector(".btnText");
const topAreaEl = document.getElementById("topArea");
const statusEl = document.getElementById("status");
const loadingCardEl = document.getElementById("loadingCard");
const resultEl = document.getElementById("result");
const gradeBarEl = document.getElementById("gradeBar");
const gradeMarkerEl = document.getElementById("gradeMarker");
const siteEl = document.getElementById("site");
const scoreEl = document.getElementById("score");
const bulletsEl = document.getElementById("bullets");
const detailBtn = document.getElementById("detailBtn");

let lastResult = null;

detailBtn.disabled = true;

function setStatus(message) {
  statusEl.textContent = message || "";
}

function setLoading(isLoading) {
  analyzeBtn.disabled = isLoading;

  if (isLoading) {
    btnTextEl.textContent = "Analizando…";
    loadingCardEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
  } else {
    btnTextEl.textContent = "Analizar web";
    loadingCardEl.classList.add("hidden");
  }
}

function setTopCollapsed(collapsed) {
  topAreaEl.classList.toggle("hidden", collapsed);
}

function safeText(value, fallback = "—") {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text.length ? text : fallback;
}

function stripLeadingEmoji(text) {
  return String(text || "").replace(/^\s*[\p{Extended_Pictographic}‍️]+\s*/u, "").trim();
}

function emojiForBullet(text) {
  const value = String(text || "").toLowerCase();

  if (value.includes("venta") || value.includes("monetiz") || value.includes("sell")) return "🛑";
  if (value.includes("cookie")) return "🍪";

  const hasNegative =
    value.includes("no ") ||
    value.includes("sin ") ||
    value.includes("no se ") ||
    value.includes("no permite") ||
    value.includes("no mencion") ||
    value.includes("no hay");

  if (!hasNegative) {
    if (value.includes("derechos") || value.includes("borrado") || value.includes("acceso") || value.includes("portabil")) return "✅";
    if (value.includes("rechazar") && value.includes("permite")) return "✅";
  }

  if (
    value.includes("tercer") ||
    value.includes("partner") ||
    value.includes("tracking") ||
    value.includes("publicidad") ||
    value.includes("perfil") ||
    value.includes("retenci") ||
    value.includes("indefin") ||
    value.includes("transfer") ||
    value.includes("fingerprint") ||
    value.includes("banner") ||
    value.includes("consent")
  ) {
    return "⚠️";
  }

  return "ℹ️";
}

function renderBullets(bullets) {
  bulletsEl.innerHTML = "";

  const visibleBullets = Array.isArray(bullets) ? bullets.slice(0, 8) : [];

  visibleBullets.forEach((raw) => {
    const text = stripLeadingEmoji(raw);
    const item = document.createElement("li");

    const emoji = document.createElement("span");
    emoji.className = "emo";
    emoji.textContent = emojiForBullet(text);

    const copy = document.createElement("span");
    copy.className = "txt";
    copy.textContent = text;

    item.appendChild(emoji);
    item.appendChild(copy);
    bulletsEl.appendChild(item);
  });
}

function renderResult(result) {
  resultEl.classList.remove("hidden");

  const grade = safeText(result.grade, "—");
  const score = Number.isFinite(result.score) ? result.score : null;

  gradeBarEl.dataset.grade = ["A", "B", "C", "D", "E"].includes(grade) ? grade : "unknown";
  gradeMarkerEl.textContent = ["A", "B", "C", "D", "E"].includes(grade) ? grade : "?";

  siteEl.textContent = safeText(result.host);
  scoreEl.textContent = score === null ? "—" : `${score}/100`;
  renderBullets(result.bullets);

  detailBtn.disabled = !result.report;
  setTopCollapsed(true);
}

async function openFrontendReport() {
  if (!lastResult?.report) {
    setStatus("Analiza una web antes de abrir el detalle.");
    return;
  }

  try {
    const settings = await chrome.storage.local.get({ frontendBaseUrl: DEFAULT_FRONTEND_BASE_URL });
    const targetUrl = buildFrontendDetailUrl(settings.frontendBaseUrl, lastResult.report);
    await chrome.tabs.create({ url: targetUrl });
  } catch (error) {
    console.error(error);
    setStatus("No se pudo abrir el frontend configurado.");
  }
}

async function analyzeCurrentTab() {
  setStatus("");
  setTopCollapsed(false);
  setLoading(true);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab?.url) throw new Error("No se pudo obtener la pestaña activa.");

    const result = await chrome.runtime.sendMessage({
      type: "ANALYZE_TAB",
      tabId: tab.id,
      url: tab.url,
    });

    if (!result || typeof result !== "object") {
      throw new Error("Respuesta inválida del analizador.");
    }

    lastResult = result;
    renderResult(result);
  } catch (error) {
    console.error(error);
    setStatus("Error analizando esta web.");
    setTopCollapsed(false);
    detailBtn.disabled = true;
  } finally {
    setLoading(false);
  }
}

analyzeBtn.addEventListener("click", analyzeCurrentTab);
detailBtn.addEventListener("click", openFrontendReport);

setStatus("");
setTopCollapsed(false);
