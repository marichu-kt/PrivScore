// src/background/analyzer_keywords.js
// Análisis por reglas/keywords (sin IA).
// Extrae señales legales del texto + señales técnicas (cookies + pageSignals).

function countMatches(text, patterns) {
  let count = 0;
  for (const re of patterns) {
    const m = text.match(re);
    if (m) count += m.length;
  }
  return count;
}

function firstSnippet(text, re, window = 90) {
  const m = re.exec(text);
  if (!m) return "";
  const start = Math.max(0, m.index - window);
  const end = Math.min(text.length, m.index + m[0].length + window);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function clamp01(x) {
  const n = Number(x) || 0;
  return Math.max(0, Math.min(1, n));
}

function parseRetentionDays(textLower) {
  const re = /(\d{1,4})\s*(d[ií]as?|days?|mes(?:es)?|months?|a[nñ]os?|years?)/gi;
  let m;
  let best = null;
  while ((m = re.exec(textLower))) {
    const n = Number(m[1]);
    const unit = (m[2] || "").toLowerCase();
    if (!Number.isFinite(n)) continue;
    let days = n;
    if (unit.startsWith("mes") || unit.startsWith("month")) days = n * 30;
    if (unit.startsWith("a") || unit.startsWith("year")) days = n * 365;
    if (best === null || days < best) best = days;
  }
  return best;
}

export function analyzeByKeywords(policyText, cookieSummary = {}, pageSignals = {}) {
  const raw = (policyText || "").toString();
  const t = raw.toLowerCase();

  const partialReasons = [];
  if (!raw.trim()) partialReasons.push("No se pudo leer la política (o no se encontró enlace claro).");
  else if (raw.trim().length < 350) partialReasons.push("Texto legal muy corto: la nota puede ser estimada.");

  // --- Patterns (ES+EN) ---
  const RE = {
    sale: [
      /\bvendemos\b/g,
      /\bventa de datos\b/g,
      /\bcomercializamos\b/g,
      /\bmonetizamos\b/g,
      /\bsell(?:s|ing)?\b/g,
      /\bsale of (?:your|personal) data\b/g,
      /\bdata\s+broker\b/g
    ],
    saleNeg: [
      /\bno\s+vendemos\b/g,
      /\bno\s+vend(?:a|emos)\b/g,
      /\bdo\s+not\s+sell\b/g,
      /\bwe\s+do\s+not\s+sell\b/g
    ],
    thirdParty: [
      /\bterceros\b/g,
      /\bpartners?\b/g,
      /\bsocios\b/g,
      /\bafiliad(?:os|as)?\b/g,
      /\bproveedores?\b/g,
      /\bprestadores? de servicios?\b/g,
      /\bservice providers?\b/g,
      /\bthird part(?:y|ies)\b/g,
      /\baffiliates?\b/g
    ],
    adsTracking: [
      /\bpublicidad personalizada\b/g,
      /\bpublicidad\b/g,
      /\bmarketing\b/g,
      /\bremarketing\b/g,
      /\btracking\b/g,
      /\bperfilad(?:o|os)\b/g,
      /\bprofil(?:e|ing)\b/g,
      /\btargeted (?:ads|advertising)\b/g,
      /\bpersonalized (?:ads|advertising)\b/g,
      /\badvertis(?:e|ing)\b/g
    ],
    retentionBad: [
      /\bindefinid(?:o|a|amente)\b/g,
      /\bindefinite(?:ly)?\b/g,
      /\bmientras sea necesario\b/g,
      /\bas long as necessary\b/g,
      /\bpor el tiempo necesario\b/g,
      /\bno especifica\b/g,
      /\bnot specify\b/g,
      /\bfor as long as\b/g
    ],
    rights: [
      /\bderechos?\b/g,
      /\bacceso\b/g,
      /\brectificaci[oó]n\b/g,
      /\bborrad(?:o|a)\b/g,
      /\bsupresi[oó]n\b/g,
      /\boposici[oó]n\b/g,
      /\bportabilid(?:ad|ade)\b/g,
      /\blimitaci[oó]n\b/g,
      /\baccess\b/g,
      /\brectification\b/g,
      /\berasure\b/g,
      /\bdeletion\b/g,
      /\bportability\b/g,
      /\brestriction\b/g
    ],
    intlTransfers: [
      /\btransferencias internacionales\b/g,
      /\boutside (?:the )?eea\b/g,
      /\binternational transfers?\b/g,
      /\bcross[- ]border\b/g
    ]
  };

  // Conteos
  const saleCount = countMatches(t, RE.sale);
  const saleNegCount = countMatches(t, RE.saleNeg);
  const thirdPartyCount = countMatches(t, RE.thirdParty);
  const adsCount = countMatches(t, RE.adsTracking);
  const retentionBadCount = countMatches(t, RE.retentionBad);
  const rightsCount = countMatches(t, RE.rights);
  const intlCount = countMatches(t, RE.intlTransfers);

  const saleHit = saleCount > 0 && saleNegCount === 0;

  // Señales técnicas extra (de pageSignals)
  const ext = pageSignals?.external || {};
  const st = pageSignals?.storage || {};
  const consent = pageSignals?.consent || {};

  const possibleFingerprinting = !!ext.possibleFingerprinting;
  const storageTracking = Number(st.trackingKeysCount || 0) >= 2;

  const hits = {
    sale: saleHit,
    thirdParty: thirdPartyCount > 0,
    ads: adsCount > 0,
    retentionBad: retentionBadCount > 0,
    rights: rightsCount > 0,
    intlTransfers: intlCount > 0,

    fingerprinting: possibleFingerprinting,
    storageTracking: storageTracking,
    cmpNoReject: !!(consent.detected && consent.hasAccept && !consent.hasReject)
  };

  const intensity = {
    thirdParty: Math.min(3, Math.max(0, Math.ceil(thirdPartyCount / 2))),
    ads: Math.min(3, Math.max(0, Math.ceil(adsCount / 2))),
    rights: Math.min(3, Math.max(0, Math.ceil(rightsCount / 2)))
  };

  // Evidence snippets (solo del texto legal)
  const evidence = {
    sale: "",
    thirdParty: "",
    ads: "",
    retention: "",
    rights: ""
  };

  if (saleHit) {
    for (const re of RE.sale) {
      re.lastIndex = 0;
      const sn = firstSnippet(raw, re);
      if (sn) { evidence.sale = sn; break; }
    }
  }
  if (hits.thirdParty) {
    for (const re of RE.thirdParty) {
      re.lastIndex = 0;
      const sn = firstSnippet(raw, re);
      if (sn) { evidence.thirdParty = sn; break; }
    }
  }
  if (hits.ads) {
    for (const re of RE.adsTracking) {
      re.lastIndex = 0;
      const sn = firstSnippet(raw, re);
      if (sn) { evidence.ads = sn; break; }
    }
  }
  if (hits.retentionBad) {
    for (const re of RE.retentionBad) {
      re.lastIndex = 0;
      const sn = firstSnippet(raw, re);
      if (sn) { evidence.retention = sn; break; }
    }
  }
  if (hits.rights) {
    for (const re of RE.rights) {
      re.lastIndex = 0;
      const sn = firstSnippet(raw, re);
      if (sn) { evidence.rights = sn; break; }
    }
  }

  // Retención numérica
  const days = parseRetentionDays(t);
  const retention = {};
  if (typeof days === "number") retention.days = days;

  // Cookies helpers
  const totalCookies = Number(cookieSummary.totalCookies || 0);
  const persistentCookies = Number(cookieSummary.persistentCookies || 0);
  const thirdPartyCookies = Number(cookieSummary.thirdPartyCookies || 0);

  const cookies = {
    totalCookies,
    persistentCookies,
    thirdPartyCookies,
    categoryCounts: cookieSummary.categoryCounts || null,
    manyCookies: totalCookies >= 12,
    manyPersistent: persistentCookies >= 6
  };

  // Confianza (heurística)
  let conf = 0.55;
  if (raw.length >= 2000) conf += 0.1;
  if (raw.length >= 6000) conf += 0.05;
  if (saleCount + thirdPartyCount + adsCount + rightsCount + retentionBadCount > 0) conf += 0.08;
  if (totalCookies > 0) conf += 0.03;
  if (partialReasons.length) conf -= 0.15;
  conf = clamp01(conf);

  return {
    hits,
    intensity,
    cookies,
    page: pageSignals || {},
    retention,
    evidence,
    confidence: conf,
    partialReasons
  };
}
