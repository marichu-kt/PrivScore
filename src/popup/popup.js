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
const copyBtn = document.getElementById("copyBtn");

function setStatus(msg) {
  statusEl.textContent = msg || "";
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
  // Tras analizar con éxito, ocultamos el hero + botón para dejar solo el resultado.
  if (collapsed) topAreaEl.classList.add("hidden");
  else topAreaEl.classList.remove("hidden");
}

function safeText(x, fallback = "—") {
  if (x === null || x === undefined) return fallback;
  const s = String(x).trim();
  return s.length ? s : fallback;
}

function stripLeadingEmoji(text) {
  // Elimina un emoji inicial si el bullet ya lo trae dentro (por si acaso).
  return String(text || "").replace(/^\s*[\p{Extended_Pictographic}\u200D\uFE0F]+\s*/u, "").trim();
}

function emojiForBullet(text) {
  const t = (text || "").toLowerCase();

  // Alto riesgo
  if (t.includes("venta") || t.includes("monetiz") || t.includes("vendemos") || t.includes("sell")) return "🛑";

  // Cookies/info
  if (t.includes("cookie")) return "🍪";

  // Positivo (solo si no hay negación cerca)
  const hasNeg =
    t.includes("no ") ||
    t.includes("sin ") ||
    t.includes("no se ") ||
    t.includes("no permite") ||
    t.includes("no mencion") ||
    t.includes("no hay") ||
    t.includes("sin opción") ||
    t.includes("sin opcion");

  if (!hasNeg) {
    if (t.includes("derechos") || t.includes("borrado") || t.includes("acceso") || t.includes("portabil")) return "✅";
    if (t.includes("permite rechazar") || (t.includes("permite") && t.includes("rechazar"))) return "✅";
  }

  // Medio / avisos
  if (
    t.includes("tercer") ||
    t.includes("partner") ||
    t.includes("tracking") ||
    t.includes("publicidad") ||
    t.includes("perfil") ||
    t.includes("retenci") ||
    t.includes("indefin") ||
    t.includes("transfer") ||
    t.includes("fingerprint") ||
    t.includes("banner") ||
    t.includes("consent")
  ) {
    return "⚠️";
  }

  return "ℹ️";
}

function renderBullets(bullets) {
  bulletsEl.innerHTML = "";

  const arr = Array.isArray(bullets) ? bullets : [];
  const shown = arr.slice(0, 8);

  for (const raw of shown) {
    const text = stripLeadingEmoji(raw);
    const li = document.createElement("li");

    const emo = document.createElement("span");
    emo.className = "emo";
    emo.textContent = emojiForBullet(text);

    const txt = document.createElement("span");
    txt.className = "txt";
    txt.textContent = text;

    li.appendChild(emo);
    li.appendChild(txt);
    bulletsEl.appendChild(li);
  }
}

function renderResult(res) {
  resultEl.classList.remove("hidden");

  const grade = safeText(res.grade, "—");
  const score = Number.isFinite(res.score) ? res.score : null;

  // Barra A–E
  gradeBarEl.dataset.grade = ["A", "B", "C", "D", "E"].includes(grade) ? grade : "unknown";
  gradeMarkerEl.textContent = ["A", "B", "C", "D", "E"].includes(grade) ? grade : "?";

  // Meta
  siteEl.textContent = safeText(res.host);
  scoreEl.textContent = score === null ? "—" : `${score}/100`;

  // Bullets
  renderBullets(res.bullets);

  // Colapsa hero
  setTopCollapsed(true);
}

async function analyzeCurrentTab() {
  setStatus("");
  setTopCollapsed(false);
  setLoading(true);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) throw new Error("No se pudo obtener la pestaña activa.");

    const res = await chrome.runtime.sendMessage({
      type: "ANALYZE_TAB",
      tabId: tab.id,
      url: tab.url
    });

    if (!res || typeof res !== "object") throw new Error("Respuesta inválida del analizador.");

    renderResult(res);
  } catch (e) {
    console.error(e);
    setStatus("Error analizando esta web.");
    setTopCollapsed(false);
  } finally {
    setLoading(false);
  }
}

analyzeBtn.addEventListener("click", analyzeCurrentTab);

detailBtn.addEventListener("click", () => {
  // Abre la vista detalle (lee lastReport desde storage.local)
  chrome.tabs.create({ url: chrome.runtime.getURL("src/detail/detail.html") });
});

copyBtn.addEventListener("click", async () => {
  try {
    const site = siteEl.textContent || "";
    const score = scoreEl.textContent || "";
    const lines = Array.from(bulletsEl.querySelectorAll(".txt")).map((n) => `- ${n.textContent}`);
    const text = `PrivScore\n${site}\n${score}\n\n${lines.join("\n")}`.trim();

    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copiado";
    setTimeout(() => (copyBtn.textContent = "Copiar"), 900);
  } catch (e) {
    console.error(e);
    setStatus("No se pudo copiar.");
  }
});

// Estado inicial
setStatus("");
setTopCollapsed(false);
