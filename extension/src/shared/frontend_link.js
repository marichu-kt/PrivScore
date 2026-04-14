export const DEFAULT_FRONTEND_BASE_URL = "http://localhost:5173/";

function bytesToBase64Url(bytes) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function normalizeBaseUrl(input = DEFAULT_FRONTEND_BASE_URL) {
  const raw = String(input || DEFAULT_FRONTEND_BASE_URL).trim() || DEFAULT_FRONTEND_BASE_URL;
  const url = new URL(raw);
  url.hash = "";
  return url;
}

export function buildFrontendPayload(report = {}) {
  const cookies = report.cookies || {};
  const page = report.page || {};

  return {
    host: report.host || "",
    pageTitle: report.pageTitle || "",
    url: report.url || "",
    analyzedAt: report.analyzedAt || Date.now(),
    mode: report.mode || "keywords",
    policyUrl: report.policyUrl || "",
    score: report.score ?? 0,
    grade: report.grade || "C",
    colorHex: report.colorHex || "",
    confidence: report.confidence ?? 0,
    estimated: !!report.estimated,
    breakdown: report.breakdown || {},
    bullets: Array.isArray(report.bullets) ? report.bullets.slice(0, 8) : [],
    partialReasons: Array.isArray(report.partialReasons) ? report.partialReasons.slice(0, 4) : [],
    evidence: report.evidence || {},
    retention: report.retention || {},
    cookies: {
      total: cookies.total || 0,
      persistent: cookies.persistent || 0,
      thirdPartyEst: cookies.thirdPartyEst || 0,
      maxExpirationDays: cookies.maxExpirationDays || 0,
      categories: cookies.categories || {},
      topDomains: Array.isArray(cookies.topDomains) ? cookies.topDomains.slice(0, 8) : [],
      list: Array.isArray(cookies.list) ? cookies.list.slice(0, 12) : [],
    },
    page: {
      external: page.external || {},
      storage: page.storage || {},
      consent: page.consent || {},
    },
  };
}

export function buildFrontendDetailUrl(baseUrl, report) {
  const payload = buildFrontendPayload(report);
  const json = JSON.stringify(payload);
  const encoded = bytesToBase64Url(new TextEncoder().encode(json));
  const url = normalizeBaseUrl(baseUrl);
  url.hash = `/analysis?report=${encoded}`;
  return url.toString();
}
