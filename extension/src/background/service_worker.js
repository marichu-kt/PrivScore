import { analyzeByKeywords } from "./analyzer_keywords.js";
import { computeScoreFromSignals } from "./scoring.js";
import { fetchFirstWorkingPolicyText } from "./policy_fetcher.js";
import { getCookiesSummaryFromUrl, cookiesSummaryToText } from "./cookies_summary.js";
import { geminiExtractSignals } from "./gemini_client.js";
import { buildFrontendDetailUrl, DEFAULT_FRONTEND_BASE_URL } from "../shared/frontend_link.js";
import { applyCatalogScore } from "../shared/catalog_scores.js";

const DEFAULTS = {
  useAI: false,
  geminiApiKey: "",
  geminiModelId: "gemini-2.5-flash-lite",
  geminiTimeoutMs: 12000,
  frontendBaseUrl: DEFAULT_FRONTEND_BASE_URL,
};

async function loadSettings() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...settings };
}

async function injectAndCollect(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/content/content_script.js"],
  });

  const response = await chrome.tabs.sendMessage(tabId, { type: "FIND_POLICY_LINKS" });
  return {
    links: response?.links || [],
    fallbacks: response?.fallbacks || [],
    pageSignals: response?.pageSignals || {},
    pageTitle: response?.pageTitle || "",
  };
}

function buildCandidateUrls(links = [], fallbacks = []) {
  const urls = [];
  links.forEach((entry) => entry?.href && urls.push(entry.href));
  fallbacks.forEach((entry) => entry?.href && urls.push(entry.href));
  return Array.from(new Set(urls)).slice(0, 8);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function summarizePageSignals(pageSignals = {}) {
  const external = pageSignals?.external || {};
  const storage = pageSignals?.storage || {};
  const consent = pageSignals?.consent || {};
  const top = (external.topDomains || [])
    .slice(0, 5)
    .map((entry) => `${entry.domain}(${entry.count}${entry.category ? `,${entry.category}` : ""})`)
    .join(", ");

  return [
    `third_party_domains=${Number(external.thirdPartyDomains || 0)}`,
    `third_party_resources=${Number(external.thirdPartyResources || 0)}`,
    `external_categories=ads:${Number(external?.categoryCounts?.ads || 0)}, analytics:${Number(external?.categoryCounts?.analytics || 0)}, social:${Number(external?.categoryCounts?.social || 0)}`,
    `possible_fingerprinting=${external.possibleFingerprinting ? "yes" : "no"}`,
    `storage_keys_local=${Number(storage.localKeysCount || 0)}, session=${Number(storage.sessionKeysCount || 0)}`,
    `storage_tracking_keys=${Number(storage.trackingKeysCount || 0)} sample=${(storage.trackingKeysSample || []).slice(0, 6).join(",")}`,
    `cmp_detected=${consent.detected ? "yes" : "no"} provider=${consent.provider || ""} accept=${consent.hasAccept ? "yes" : "no"} reject=${consent.hasReject ? "yes" : "no"}`,
    top ? `top_domains=${top}` : "",
  ].filter(Boolean).join("\n");
}

function mergeAiIntoSignals(ai, baseSignals) {
  const signals = structuredClone(baseSignals);
  const tri = (value) => (value === "si" ? true : value === "no" ? false : null);

  const sale = tri(ai.venta_de_datos);
  const third = tri(ai.comparticion_con_terceros);
  const ads = tri(ai.ads_tracking);

  if (sale !== null) signals.hits.sale = sale;
  if (third !== null) signals.hits.thirdParty = third || signals.hits.thirdParty;
  if (ads !== null) signals.hits.ads = ads || signals.hits.ads;

  const retention = String(ai.retencion || "").toLowerCase();
  const rights = String(ai.derechos || "").toLowerCase();

  if (retention && /indefin|no especifica|as long as|necessary|tiempo necesario|for as long as/i.test(retention)) {
    signals.hits.retentionBad = true;
  }

  const match = retention.match(/(\d{1,4})\s*(d[ií]as?|days?|mes(?:es)?|months?|a[nñ]os?|years?)/i);
  if (match && !signals.retention?.days) {
    const amount = Number(match[1]);
    const unit = (match[2] || "").toLowerCase();
    let days = amount;
    if (unit.startsWith("mes") || unit.startsWith("month")) days = amount * 30;
    if (unit.startsWith("a") || unit.startsWith("year")) days = amount * 365;
    if (Number.isFinite(days)) signals.retention.days = days;
  }

  if (rights && /borr|supres|access|rectif|portab|opos|restriction|limitaci|erasure|deletion/i.test(rights)) {
    signals.hits.rights = true;
  }

  if (ai.evidencia) {
    if (ai.evidencia.venta) signals.evidence.sale = ai.evidencia.venta;
    if (ai.evidencia.terceros) signals.evidence.thirdParty = ai.evidencia.terceros;
    if (ai.evidencia.ads) signals.evidence.ads = ai.evidencia.ads;
  }

  signals.confidence = clamp01((Number(baseSignals.confidence || 0.5) * 0.7) + (Number(ai.confidence || 0) * 0.3));
  return signals;
}

async function openFrontendForLastReport() {
  const settings = await loadSettings();
  const { lastReport } = await chrome.storage.local.get({ lastReport: null });
  const target = lastReport
    ? buildFrontendDetailUrl(settings.frontendBaseUrl, lastReport)
    : settings.frontendBaseUrl;

  await chrome.tabs.create({ url: target });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("[PrivScore] Service worker instalado.");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "OPEN_LAST_REPORT") {
    openFrontendForLastReport()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => {
        console.error("[PrivScore] No se pudo abrir el frontend:", error);
        sendResponse({ ok: false, error: String(error) });
      });
    return true;
  }

  if (message?.type !== "ANALYZE_TAB") return false;

  (async () => {
    const { tabId, url } = message;
    const host = new URL(url).hostname;
    const settings = await loadSettings();

    let cookieSummary;
    try {
      cookieSummary = await getCookiesSummaryFromUrl(url);
    } catch (error) {
      console.warn("[PrivScore] Error leyendo cookies:", error);
      cookieSummary = {
        host,
        totalCookies: 0,
        persistentCookies: 0,
        sessionCookies: 0,
        firstPartyCookies: 0,
        thirdPartyCookies: 0,
        maxExpirationDays: 0,
        topDomains: [],
        categoryCounts: { ads: 0, analytics: 0, social: 0, essential: 0, other: 0 },
        sampleCookies: [],
      };
    }

    let links = [];
    let fallbacks = [];
    let pageSignals = {};
    let pageTitle = "";
    try {
      const collected = await injectAndCollect(tabId);
      links = collected.links;
      fallbacks = collected.fallbacks;
      pageSignals = collected.pageSignals;
      pageTitle = collected.pageTitle;
    } catch (error) {
      console.warn("[PrivScore] Error inyectando content script:", error);
    }

    const candidates = buildCandidateUrls(links, fallbacks);
    let policyText = "";
    let policyUrl = "";

    if (candidates.length) {
      try {
        const output = await fetchFirstWorkingPolicyText(candidates, {
          timeoutMs: 12000,
          maxChars: 15000,
        });
        policyText = output.text || "";
        policyUrl = output.finalUrl || candidates[0] || "";
      } catch (error) {
        console.warn("[PrivScore] Error descargando política:", error);
      }
    }

    const cookieMini = {
      totalCookies: cookieSummary.totalCookies,
      persistentCookies: cookieSummary.persistentCookies,
      thirdPartyCookies: cookieSummary.thirdPartyCookies,
      categoryCounts: cookieSummary.categoryCounts,
    };

    const baseSignals = analyzeByKeywords(policyText, cookieMini, pageSignals);

    let mode = "keywords";
    let finalSignals = baseSignals;

    if (settings.useAI && (settings.geminiApiKey || "").trim()) {
      try {
        const ai = await geminiExtractSignals({
          apiKey: settings.geminiApiKey,
          modelId: settings.geminiModelId,
          timeoutMs: settings.geminiTimeoutMs,
          cookieSummaryText: cookiesSummaryToText(cookieSummary),
          pageSignalsText: summarizePageSignals(pageSignals),
          policyText: policyText || "(sin texto legal disponible)",
        });

        finalSignals = mergeAiIntoSignals(ai, baseSignals);
        mode = "ai";
      } catch (error) {
        console.warn("[PrivScore] La extracción con IA falló, se mantiene el modo keywords:", error);
      }
    }

    const liveScored = computeScoreFromSignals(finalSignals);
    const scored = applyCatalogScore(liveScored, { host, pageTitle, url, policyUrl });

    const report = {
      host,
      pageTitle,
      url,
      analyzedAt: Date.now(),
      mode,
      policyUrl,
      score: scored.score,
      grade: scored.grade,
      colorHex: scored.colorHex,
      confidence: scored.confidence,
      estimated: scored.estimated,
      breakdown: scored.breakdown,
      bullets: scored.bullets,
      partialReasons: finalSignals.partialReasons || [],
      evidence: finalSignals.evidence || {},
      retention: finalSignals.retention || {},
      cookies: {
        total: cookieSummary.totalCookies,
        persistent: cookieSummary.persistentCookies,
        thirdPartyEst: cookieSummary.thirdPartyCookies,
        maxExpirationDays: cookieSummary.maxExpirationDays,
        categories: cookieSummary.categoryCounts,
        topDomains: cookieSummary.topDomains,
        list: cookieSummary.sampleCookies,
      },
      page: finalSignals.page || pageSignals || {},
    };

    await chrome.storage.local.set({ lastReport: report, lastReportAt: report.analyzedAt });

    sendResponse({
      host,
      pageTitle,
      score: scored.score,
      grade: scored.grade,
      colorHex: scored.colorHex,
      confidence: scored.confidence,
      estimated: scored.estimated,
      breakdown: scored.breakdown,
      bullets: scored.bullets,
      partialReasons: finalSignals.partialReasons || [],
      mode,
      policyUrl,
      cookiesTotal: cookieSummary.totalCookies,
      cookiesPersistent: cookieSummary.persistentCookies,
      thirdPartyDomains: Number(finalSignals?.page?.external?.thirdPartyDomains || 0),
      thirdPartyResources: Number(finalSignals?.page?.external?.thirdPartyResources || 0),
      cmpProvider: finalSignals?.page?.consent?.provider || "",
      cmpHasReject: !!finalSignals?.page?.consent?.hasReject,
      report,
    });
  })().catch((error) => {
    console.error("[PrivScore] Error fatal:", error);
    sendResponse({
      host: "—",
      pageTitle: "",
      score: 0,
      grade: "E",
      colorHex: "#b42318",
      confidence: 0,
      estimated: true,
      breakdown: null,
      bullets: ["Error interno analizando la web."],
      partialReasons: ["Error interno."],
      mode: "keywords",
      policyUrl: "",
      cookiesTotal: "—",
      cookiesPersistent: "—",
      thirdPartyDomains: "—",
      thirdPartyResources: "—",
      cmpProvider: "",
      cmpHasReject: false,
      report: null,
    });
  });

  return true;
});
