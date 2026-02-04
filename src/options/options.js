const useAIEl = document.getElementById("useAI");
const apiKeyEl = document.getElementById("apiKey");
const modelIdEl = document.getElementById("modelId");
const timeoutMsEl = document.getElementById("timeoutMs");
const statusEl = document.getElementById("status");

const DEFAULTS = {
  useAI: false,
  geminiApiKey: "",
  // Recomendado (evita modelos a punto de retirarse):
  // https://ai.google.dev/gemini-api/docs/models
  geminiModelId: "gemini-2.5-flash-lite",
  geminiTimeoutMs: 12000
};

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

async function load() {
  // Usamos storage.local para no sincronizar la API key entre dispositivos.
  const s = await chrome.storage.local.get(DEFAULTS);
  useAIEl.checked = !!s.useAI;
  apiKeyEl.value = s.geminiApiKey || "";
  modelIdEl.value = s.geminiModelId || DEFAULTS.geminiModelId;
  timeoutMsEl.value = String(s.geminiTimeoutMs || DEFAULTS.geminiTimeoutMs);
}

async function save() {
  const useAI = useAIEl.checked;
  const geminiApiKey = apiKeyEl.value.trim();
  const geminiModelId = modelIdEl.value.trim() || DEFAULTS.geminiModelId;
  const geminiTimeoutMs = Math.max(2000, Number(timeoutMsEl.value || DEFAULTS.geminiTimeoutMs));

  await chrome.storage.local.set({ useAI, geminiApiKey, geminiModelId, geminiTimeoutMs });
  setStatus("Guardado.");
  setTimeout(() => setStatus(""), 1200);
}

async function clearKey() {
  apiKeyEl.value = "";
  await chrome.storage.local.set({ geminiApiKey: "" });
  setStatus("API key borrada.");
  setTimeout(() => setStatus(""), 1200);
}

document.getElementById("saveBtn").addEventListener("click", save);
document.getElementById("clearBtn").addEventListener("click", clearKey);

load();
