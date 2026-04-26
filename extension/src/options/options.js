const useAIEl = document.getElementById("useAI");
const apiKeyEl = document.getElementById("apiKey");
const modelIdEl = document.getElementById("modelId");
const timeoutMsEl = document.getElementById("timeoutMs");
const frontendBaseUrlEl = document.getElementById("frontendBaseUrl");
const statusEl = document.getElementById("status");

const DEFAULTS = {
  useAI: false,
  geminiApiKey: "",
  geminiModelId: "gemini-2.5-flash-lite",
  geminiTimeoutMs: 12000,
  frontendBaseUrl: "https://marichu-kt.github.io/PrivScore/",
};

function setStatus(message) {
  statusEl.textContent = message || "";
}

async function load() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  useAIEl.checked = !!settings.useAI;
  apiKeyEl.value = settings.geminiApiKey || "";
  modelIdEl.value = settings.geminiModelId || DEFAULTS.geminiModelId;
  timeoutMsEl.value = String(settings.geminiTimeoutMs || DEFAULTS.geminiTimeoutMs);
  frontendBaseUrlEl.value = settings.frontendBaseUrl || DEFAULTS.frontendBaseUrl;
}

async function save() {
  const useAI = useAIEl.checked;
  const geminiApiKey = apiKeyEl.value.trim();
  const geminiModelId = modelIdEl.value.trim() || DEFAULTS.geminiModelId;
  const geminiTimeoutMs = Math.max(2000, Number(timeoutMsEl.value || DEFAULTS.geminiTimeoutMs));
  const frontendBaseUrl = frontendBaseUrlEl.value.trim() || DEFAULTS.frontendBaseUrl;

  await chrome.storage.local.set({ useAI, geminiApiKey, geminiModelId, geminiTimeoutMs, frontendBaseUrl });
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
