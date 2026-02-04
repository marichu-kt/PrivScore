// src/background/service_worker.js (REAL)
// IA (si se usa) SOLO extrae señales; la letra sale de scoring determinista.
// Flujo: popup -> ANALYZE_TAB
// 1) cookies summary
// 2) inyecta content_script: links + señales técnicas (terceros/storage/CMP)
// 3) descarga y limpia política (si se encuentra)
// 4) keywords (base) + (opcional) Gemini para mejorar extracción legal
// 5) responde al popup con resumen + reporte completo (para vista detalle)

import { analyzeByKeywords } from "./analyzer_keywords.js";
import { computeScoreFromSignals } from "./scoring.js";
import { fetchFirstWorkingPolicyText } from "./policy_fetcher.js";
import { getCookiesSummaryFromUrl, cookiesSummaryToText } from "./cookies_summary.js";
import { geminiExtractSignals } from "./gemini_client.js";

const DEFAULTS = {
  useAI: false,
  geminiApiKey: "",
  geminiModelId: "gemini-2.5-flash-lite",
  geminiTimeoutMs: 12000
};

async function loadSettings() {
  const s = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...s };
}

async function injectAndCollect(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/content/content_script.js"]
  });

  const res = await chrome.tabs.sendMessage(tabId, { type: "FIND_POLICY_LINKS" });
  return {
    links: res?.links || [],
    fallbacks: res?.fallbacks || [],
    pageSignals: res?.pageSignals || {},
    pageTitle: res?.pageTitle || ""
  };
}

function buildCandidateUrls(links, fallbacks) {
  const urls = [];
  for (const l of links || []) if (l?.href) urls.push(l.href);
  for (const f of fallbacks || []) if (f?.href) urls.push(f.href);
  return Array.from(new Set(urls)).slice(0, 8);
}

function clamp01(x) {
  return Math.max(0, Math.min(1, Number(x) || 0));
}

function summarizePageSignals(pageSignals = {}) {
  const external = pageSignals?.external || {};
  const storage = pageSignals?.storage || {};
  const consent = pageSignals?.consent || {};

  const top = (external.topDomains || [])
    .slice(0, 5)
    .map((d) => `${d.domain}(${d.count}${d.category ? "," + d.category : ""})`)
    .join(", ");

  return [
    `third_party_domains=${Number(external.thirdPartyDomains || 0)}`,
    `third_party_resources=${Number(external.thirdPartyResources || 0)}`,
    `external_categories=ads:${Number(external?.categoryCounts?.ads || 0)}, analytics:${Number(external?.categoryCounts?.analytics || 0)}, social:${Number(external?.categoryCounts?.social || 0)}`,
    `possible_fingerprinting=${external.possibleFingerprinting ? "yes" : "no"}`,
    `storage_keys_local=${Number(storage.localKeysCount || 0)}, session=${Number(storage.sessionKeysCount || 0)}`,
    `storage_tracking_keys=${Number(storage.trackingKeysCount || 0)} sample=${(storage.trackingKeysSample || []).slice(0, 6).join(",")}`,
    `cmp_detected=${consent.detected ? "yes" : "no"} provider=${consent.provider || ""} accept=${consent.hasAccept ? "yes" : "no"} reject=${consent.hasReject ? "yes" : "no"}`,
    top ? `top_domains=${top}` : ""
  ].filter(Boolean).join("\n");
}

function mergeAiIntoSignals(ai, baseSignals) {
  const signals = structuredClone(baseSignals);

  const tri = (v) => (v === "si" ? true : v === "no" ? false : null);

  const sale = tri(ai.venta_de_datos);
  const third = tri(ai.comparticion_con_terceros);
  const ads = tri(ai.ads_tracking);

  if (sale !== null) signals.hits.sale = sale;
  if (third !== null) signals.hits.thirdParty = third || signals.hits.thirdParty;
  if (ads !== null) signals.hits.ads = ads || signals.hits.ads;

  const ret = String(ai.retencion || "").toLowerCase();
  const rights = String(ai.derechos || "").toLowerCase();

  if (ret && /indefin|no especifica|as long as|necessary|tiempo necesario|for as long as/i.test(ret)) {
    signals.hits.retentionBad = true;
  }

  // Si IA indica un número, pásalo (solo si base no lo tenía)
  const m = ret.match(/(\d{1,4})\s*(d[ií]as?|days?|mes(?:es)?|months?|a[nñ]os?|years?)/i);
  if (m && !signals.retention?.days) {
    const n = Number(m[1]);
    const unit = (m[2] || "").toLowerCase();
    let days = n;
    if (unit.startsWith("mes") || unit.startsWith("month")) days = n * 30;
    if (unit.startsWith("a") || unit.startsWith("year")) days = n * 365;
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

chrome.runtime.onInstalled.addListener(() => {
  console.log("[PrivScore] Service worker instalado.");
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (!msg || msg.type !== "ANALYZE_TAB") return;

    const { tabId, url } = msg;
    const u = new URL(url);
    const host = u.hostname;

    const settings = await loadSettings();

    // 1) Cookies summary
    let cookieSummary;
    try {
      cookieSummary = await getCookiesSummaryFromUrl(url);
    } catch (e) {
      console.warn("[PrivScore] cookies summary fallo:", e);
      cookieSummary = {
        host,
        totalCookies: 0,
        persistentCookies: 0,
        sessionCookies: 0,
        firstPartyCookies: 0,
        thirdPartyCookies: 0,
        maxExpirationDays: 0,
        topDomains: [],
        categoryCounts: { ads: 0, analytics: 0, social: 0, essential: 0, other: 0 }
      };
    }

    // 2) Links + señales técnicas
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
    } catch (e) {
      console.warn("[PrivScore] content_script fallo:", e);
    }

    // 3) Política (si hay candidatos)
    const candidates = buildCandidateUrls(links, fallbacks);

    let policyText = "";
    let policyUrl = "—";
    if (candidates.length > 0) {
      try {
        const out = await fetchFirstWorkingPolicyText(candidates, {
          timeoutMs: 12000,
          maxChars: 15000
        });
        policyText = out.text || "";
        policyUrl = out.finalUrl || candidates[0];
      } catch (e) {
        console.warn("[PrivScore] fetch policy fallo:", e);
      }
    }

    // 4) Base keywords + técnica
    const cookieMini = {
      totalCookies: cookieSummary.totalCookies,
      persistentCookies: cookieSummary.persistentCookies,
      thirdPartyCookies: cookieSummary.thirdPartyCookies,
      categoryCounts: cookieSummary.categoryCounts
    };

    const baseSignals = analyzeByKeywords(policyText, cookieMini, pageSignals);

    // 5) IA opcional (solo extracción legal)
    let mode = "keywords";
    let finalSignals = baseSignals;

    if (settings.useAI && (settings.geminiApiKey || "").trim()) {
      try {
        const cookieSummaryText = cookiesSummaryToText(cookieSummary);
        const pageSignalsText = summarizePageSignals(pageSignals);

        const ai = await geminiExtractSignals({
          apiKey: settings.geminiApiKey,
          modelId: settings.geminiModelId,
          timeoutMs: settings.geminiTimeoutMs,
          cookieSummaryText,
          pageSignalsText,
          policyText: policyText || "(sin texto legal disponible)"
        });

        finalSignals = mergeAiIntoSignals(ai, baseSignals);
        mode = "ai";
      } catch (e) {
        console.warn("[PrivScore] IA fallo, usando keywords:", e);
      }
    }

    // 6) Scoring determinista
    const scored = computeScoreFromSignals(finalSignals);

    // 7) Report para vista detalle
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
        topDomains: cookieSummary.topDomains
      },
      page: finalSignals.page || {}
    };

    await chrome.storage.local.set({ lastReport: report, lastReportAt: report.analyzedAt });

    // 8) Respuesta al popup (resumen + extras UX)
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

      report
    });
  })().catch((err) => {
    console.error("[PrivScore] Error fatal:", err);
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
      policyUrl: "—",
      cookiesTotal: "—",
      cookiesPersistent: "—",
      thirdPartyDomains: "—",
      thirdPartyResources: "—",
      cmpProvider: "",
      cmpHasReject: false,
      report: null
    });
  });

  return true;
});
