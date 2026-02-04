// src/background/policy_fetcher.js
// Descarga la política (HTML/texto) y la convierte a texto limpio.
// Usa AbortController para timeout. Pensado para MV3 service worker.

import { htmlToCleanText, truncateText } from "./html_cleaner.js";

async function fetchWithTimeout(url, { timeoutMs = 12000, headers = {}, redirect = "follow" } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect,
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
        ...headers
      },
      signal: ctrl.signal
    });

    return res;
  } finally {
    clearTimeout(id);
  }
}

function looksLikeHtml(contentType, textSnippet) {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("text/html") || ct.includes("application/xhtml+xml")) return true;
  const snip = (textSnippet || "").slice(0, 200).toLowerCase();
  return snip.includes("<html") || snip.includes("<!doctype") || snip.includes("<body");
}

/**
 * Descarga la URL y devuelve el texto limpio para análisis.
 * @returns {Promise<{ finalUrl: string, text: string, contentType: string, status: number }>}
 */
export async function fetchPolicyText(policyUrl, opts = {}) {
  if (!policyUrl) throw new Error("policyUrl vacío");

  const res = await fetchWithTimeout(policyUrl, opts);
  const contentType = res.headers.get("content-type") || "";
  const status = res.status;

  // Si es 4xx/5xx, lanzamos (arriba puedes hacer try/catch y fallback)
  if (!res.ok) {
    throw new Error(`Fetch policy failed: HTTP ${status}`);
  }

  const raw = await res.text();
  const finalUrl = res.url || policyUrl;

  // Si parece HTML -> limpiamos; si no, lo tratamos como texto plano
  const isHtml = looksLikeHtml(contentType, raw);
  const cleaned = isHtml ? htmlToCleanText(raw) : raw.trim();

  return {
    finalUrl,
    text: truncateText(cleaned, opts.maxChars || 15000),
    contentType,
    status
  };
}

/**
 * Helper: intenta varias URLs hasta conseguir texto.
 * Muy útil si tienes lista de candidatos (privacy + cookies + terms).
 */
export async function fetchFirstWorkingPolicyText(urlCandidates = [], opts = {}) {
  const tried = [];
  for (const u of urlCandidates) {
    if (!u) continue;
    try {
      const out = await fetchPolicyText(u, opts);
      return { ...out, tried };
    } catch (e) {
      tried.push({ url: u, error: String(e) });
    }
  }
  throw new Error(`No se pudo descargar ninguna política. Intentos: ${tried.length}`);
}
