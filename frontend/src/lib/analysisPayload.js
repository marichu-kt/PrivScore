export const LAST_ANALYSIS_STORAGE_KEY = "privscore:last-analysis";

function decodeBase64Url(input = "") {
  const normalized = String(input)
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(String(input).length / 4) * 4, "=");

  const binary = window.atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function normalizeDomain(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const url = /^https?:\/\//i.test(raw) ? new URL(raw) : new URL(`https://${raw}`);
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return raw.toLowerCase().replace(/^www\./, "").replace(/\/$/, "");
  }
}

export function domainsMatch(left, right) {
  const a = normalizeDomain(left);
  const b = normalizeDomain(right);
  if (!a || !b) return false;
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

export function readReportFromSearch(search = "") {
  const params = new URLSearchParams(search);
  const encoded = params.get("report");
  if (!encoded) return null;

  try {
    return JSON.parse(decodeBase64Url(encoded));
  } catch (error) {
    console.error("No se pudo decodificar el análisis", error);
    return null;
  }
}

export function persistAnalysisReport(report) {
  if (!report) return;
  try {
    window.localStorage.setItem(LAST_ANALYSIS_STORAGE_KEY, JSON.stringify(report));
  } catch (error) {
    console.error("No se pudo guardar el análisis en localStorage", error);
  }
}

export function loadPersistedAnalysisReport() {
  try {
    const raw = window.localStorage.getItem(LAST_ANALYSIS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("No se pudo leer el análisis guardado", error);
    return null;
  }
}
