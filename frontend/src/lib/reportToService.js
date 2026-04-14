import { domainsMatch, normalizeDomain } from "./analysisPayload";

function titleCaseCategory(value = "") {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\w/g, (letter) => letter.toUpperCase());
}

function categoryLabel(category = "") {
  const map = {
    analytics: "Analítica",
    ads: "Publicidad",
    advertising: "Publicidad",
    social: "Social",
    essential: "Esencial",
    other: "Otro",
    consent: "Consentimiento",
    support: "Soporte",
    security: "Seguridad",
    infrastructure: "Infraestructura",
    cdn: "Infraestructura",
  };

  return map[String(category || "").toLowerCase()] || titleCaseCategory(category || "Otro");
}

function sentenceCase(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function shortNameFromHost(host = "") {
  const domain = normalizeDomain(host);
  if (!domain) return "Sitio analizado";
  return domain
    .split(".")
    .filter(Boolean)[0]
    .replace(/[-_]+/g, " ")
    .replace(/\w/g, (letter) => letter.toUpperCase());
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((Number(part || 0) / Number(total || 1)) * 100);
}

function mapBreakdown(report) {
  const breakdown = report?.breakdown || {};
  const blocks = [
    ["Trackers y superficie técnica", breakdown.trackers, "Carga técnica, medición y señales visibles en la página analizada."],
    ["Terceros y compartición", breakdown.thirdParties, "Presencia de dominios externos, socios o evidencias de compartición."],
    ["Retención y permanencia", breakdown.retention, "Plazos de conservación o señales de persistencia detectadas."],
    ["Derechos y transparencia", breakdown.rights, "Claridad sobre derechos, borrado o controles informados al usuario."],
  ];

  return blocks.map(([label, block, note]) => ({
    label,
    value: pct(block?.score, block?.outOf),
    note,
  }));
}

function mapChecklist(report) {
  const consent = report?.page?.consent || {};
  const storage = report?.page?.storage || {};
  const external = report?.page?.external || {};

  return [
    {
      label: "Banner de consentimiento",
      status: consent.detected ? (consent.hasReject ? "ok" : "warn") : "alert",
      note: consent.detected
        ? `${consent.provider || "Banner detectado"}${consent.hasReject ? " con opción de rechazo visible" : " sin rechazo claro visible"}.`
        : "No se detectó un banner o CMP claro durante la lectura automática.",
    },
    {
      label: "Terceros en carga",
      status: Number(external.thirdPartyDomains || 0) <= 3 ? "ok" : Number(external.thirdPartyDomains || 0) <= 8 ? "warn" : "alert",
      note: `${Number(external.thirdPartyDomains || 0)} dominios de terceros y ${Number(external.thirdPartyResources || 0)} recursos externos observados.`,
    },
    {
      label: "Storage en navegador",
      status: Number(storage.trackingKeysCount || 0) === 0 ? "ok" : Number(storage.trackingKeysCount || 0) <= 3 ? "warn" : "alert",
      note: `${Number(storage.localKeysCount || 0)} claves en localStorage, ${Number(storage.sessionKeysCount || 0)} en sessionStorage y ${Number(storage.trackingKeysCount || 0)} con patrones de seguimiento.`,
    },
    {
      label: "Fingerprinting probable",
      status: external.possibleFingerprinting ? "alert" : "ok",
      note: external.possibleFingerprinting
        ? "Se detectaron señales técnicas compatibles con fingerprinting o identificación persistente."
        : "No se observaron señales claras de fingerprinting en la lectura automática.",
    },
  ];
}

function mapFindings(report) {
  const bullets = Array.isArray(report?.bullets) ? report.bullets : [];
  const tones = bullets.map((bullet) => {
    const text = String(bullet || "").toLowerCase();
    if (text.includes("venta") || text.includes("publicidad") || text.includes("perfil") || text.includes("fingerprint")) return "alert";
    if (text.includes("tercer") || text.includes("retenci") || text.includes("banner") || text.includes("consent")) return "warn";
    return "neutral";
  });

  return bullets.slice(0, 6).map((bullet, index) => ({
    title: index === 0 ? "Lectura principal" : `Hallazgo ${index + 1}`,
    body: bullet,
    tone: tones[index] || "neutral",
  }));
}

function mapCookieCategories(report) {
  const cookies = report?.cookies || {};
  const total = Number(cookies.total || 0);
  const cats = cookies.categories || {};
  const entries = [
    ["Esenciales", cats.essential || 0, "good"],
    ["Analítica", cats.analytics || 0, "neutral"],
    ["Preferencias", cats.preferences || 0, "neutral"],
    ["Publicidad", cats.ads || cats.advertising || 0, "warn"],
    ["Social", cats.social || 0, "warn"],
    ["Otras", cats.other || 0, "neutral"],
  ];

  return entries
    .filter(([, value]) => total > 0 ? value >= 0 : value > 0)
    .map(([label, value, tone]) => ({ label, value: total ? pct(value, total) : 0, tone }));
}

function durationLabel(cookie) {
  if (cookie?.session) return "Sesión";
  const days = Number(cookie?.days || 0);
  if (!Number.isFinite(days) || days <= 0) return "No visible";
  if (days < 1) return `${Math.max(1, Math.round(days * 24))} h`;
  if (days < 30) return `${Math.round(days)} días`;
  if (days < 365) return `${Math.round(days / 30)} meses`;
  return `${Math.round(days / 365)} años`;
}

function mapCookies(report, matchedService) {
  const cookies = Array.isArray(report?.cookies?.list) ? report.cookies.list : [];
  if (cookies.length) {
    return cookies.map((cookie) => ({
      name: cookie.name,
      provider: cookie.domain || "Primera parte",
      duration: durationLabel(cookie),
      purpose: cookie.reason || "Cookie observada durante la navegación",
      category: categoryLabel(cookie.category),
    }));
  }

  if (matchedService?.cookies?.length) {
    return matchedService.cookies;
  }

  return (report?.cookies?.topDomains || []).slice(0, 6).map((entry) => ({
    name: entry.domain,
    provider: entry.domain,
    duration: "No visible",
    purpose: `${entry.count} cookies observadas bajo este dominio.`,
    category: "Dominio asociado",
  }));
}

function mapTrackers(report, matchedService) {
  const topDomains = Array.isArray(report?.page?.external?.topDomains) ? report.page.external.topDomains : [];
  if (topDomains.length) {
    return topDomains.slice(0, 8).map((entry) => ({
      name: entry.domain,
      company: entry.domain,
      category: categoryLabel(entry.category || "Tercero"),
      purpose: `${entry.count} recursos cargados${entry.category ? ` · ${categoryLabel(entry.category)}` : ""}`,
    }));
  }

  return matchedService?.trackers || [];
}

function mapRights(report, matchedService) {
  const bullets = Array.isArray(report?.bullets) ? report.bullets : [];
  const rights = [];

  bullets.forEach((bullet) => {
    const lower = String(bullet || "").toLowerCase();
    if (lower.includes("acceso")) rights.push("Acceso a los datos");
    if (lower.includes("borrado") || lower.includes("supresi")) rights.push("Supresión o borrado");
    if (lower.includes("portabil")) rights.push("Portabilidad");
    if (lower.includes("oposici") || lower.includes("limitaci")) rights.push("Oposición o limitación");
    if (lower.includes("consent")) rights.push("Gestión del consentimiento");
  });

  return Array.from(new Set(rights)).length ? Array.from(new Set(rights)) : (matchedService?.rights || [
    "Acceso a la información disponible",
    "Gestión del consentimiento si aplica",
    "Borrado sujeto a la política visible",
  ]);
}

function mapCollectedData(report, matchedService) {
  const storage = report?.page?.storage || {};
  const external = report?.page?.external || {};
  const data = [
    "Identificadores técnicos del navegador",
    "Cookies aplicables a la sesión",
  ];

  if (Number(storage.localKeysCount || 0) > 0) data.push("Claves persistidas en localStorage");
  if (Number(storage.sessionKeysCount || 0) > 0) data.push("Claves temporales en sessionStorage");
  if (Number(external.thirdPartyResources || 0) > 0) data.push("Señales de navegación y carga a terceros");

  return Array.from(new Set(data)).length ? Array.from(new Set(data)) : (matchedService?.collectedData || []);
}

function mapTermsHighlights(report, matchedService) {
  const bullets = Array.isArray(report?.bullets) ? report.bullets : [];
  if (bullets.length) {
    return bullets.slice(0, 5).map((bullet) => sentenceCase(bullet));
  }
  return matchedService?.termsHighlights || [];
}

function mapRetentionDetails(report, matchedService) {
  const retentionEvidence = report?.evidence?.retention || report?.retention?.evidence || "";
  const details = [];
  if (retentionEvidence) details.push(sentenceCase(retentionEvidence));
  if (report?.cookies?.maxExpirationDays) details.push(`La cookie con mayor duración visible alcanza ${report.cookies.maxExpirationDays} días.`);
  if (Array.isArray(report?.partialReasons) && report.partialReasons.length) details.push(...report.partialReasons.slice(0, 2).map(sentenceCase));
  return details.length ? details : (matchedService?.retentionDetails || ["No se identificó un plazo específico durante la lectura automática."]);
}

function mapTransfers(report, matchedService) {
  const topDomains = Array.isArray(report?.page?.external?.topDomains) ? report.page.external.topDomains : [];
  if (topDomains.length) return topDomains.slice(0, 6).map((entry) => entry.domain);
  return matchedService?.transfers || [];
}

function buildBrowserSignals(report) {
  const external = report?.page?.external || {};
  const storage = report?.page?.storage || {};
  const consent = report?.page?.consent || {};

  return {
    mode: report?.mode || "keywords",
    confidence: Math.round(Number(report?.confidence || 0) * 100),
    estimated: !!report?.estimated,
    analyzedAt: report?.analyzedAt || Date.now(),
    url: report?.url || "",
    policyUrl: report?.policyUrl || "",
    partialReasons: Array.isArray(report?.partialReasons) ? report.partialReasons : [],
    evidence: report?.evidence || {},
    externalSummary: [
      `${Number(external.thirdPartyDomains || 0)} dominios de terceros`,
      `${Number(external.thirdPartyResources || 0)} recursos externos`,
      external.possibleFingerprinting ? "Posible fingerprinting" : "Sin fingerprinting claro",
    ],
    externalDomains: Array.isArray(external.topDomains) ? external.topDomains : [],
    storageSummary: [
      `${Number(storage.localKeysCount || 0)} claves en localStorage`,
      `${Number(storage.sessionKeysCount || 0)} en sessionStorage`,
      `${Number(storage.trackingKeysCount || 0)} con patrones de tracking`,
    ],
    storageKeys: Array.isArray(storage.trackingKeysSample) ? storage.trackingKeysSample : [],
    consentSummary: consent.detected
      ? `${consent.provider || "CMP detectada"} · aceptar ${consent.hasAccept ? "sí" : "no"} · rechazar ${consent.hasReject ? "sí" : "no"}`
      : "No se detectó una CMP clara en la lectura automática.",
    consent,
  };
}

export function findCatalogMatch(services, host) {
  return services.find((service) => domainsMatch(service.domain, host)) || null;
}

export function buildServiceFromReport(report, matchedService = null) {
  const host = normalizeDomain(report?.host || report?.url || "sitio-analizado");
  const categoryCounts = report?.page?.external?.categoryCounts || {};
  const topCategory = Object.entries(categoryCounts).sort((left, right) => Number(right[1] || 0) - Number(left[1] || 0))[0]?.[0];
  const score = Number(report?.score || matchedService?.score || 0);
  const summary = Array.isArray(report?.bullets) && report.bullets.length
    ? sentenceCase(report.bullets[0])
    : matchedService?.summary || "Lectura automática generada desde la extensión sobre la web analizada.";

  const baseService = matchedService || {};
  const thirdPartyCount = Number(report?.page?.external?.thirdPartyDomains || 0) || baseService.thirdPartyCount || 0;
  const trackerCount = Number(report?.page?.external?.thirdPartyResources || 0) || baseService.trackerCount || 0;

  return {
    ...baseService,
    _id: baseService._id || `live-${host.replace(/[^a-z0-9]+/g, "-")}`,
    name: baseService.name || shortNameFromHost(host),
    domain: host,
    category: baseService.category || categoryLabel(topCategory || "análisis").replace("Analítica", "Analítica web"),
    rating: report?.grade || baseService.rating || "C",
    score,
    location: baseService.location || "Lectura en navegador",
    reviewStatus: matchedService ? "Catálogo + análisis en vivo" : "Análisis en vivo",
    tagline: baseService.tagline || `Resultado abierto desde la extensión para ${host}.`,
    summary,
    updatedAt: new Date(report?.analyzedAt || Date.now()).toISOString(),
    privacyHighlights: Array.from(new Set([...(baseService.privacyHighlights || []), ...(report?.bullets || []).slice(0, 3)])).slice(0, 5),
    strength: baseService.strength || "La ficha concentra el resultado real del análisis en una lectura única dentro del frontend.",
    caution: baseService.caution || "Las señales automáticas pueden variar si cambian los scripts cargados o la experiencia de consentimiento.",
    cookieSummary: {
      total: Number(report?.cookies?.total || 0),
      essential: Number(report?.cookies?.categories?.essential || 0),
      analytics: Number(report?.cookies?.categories?.analytics || 0),
      preferences: Number(report?.cookies?.categories?.preferences || 0),
      advertising: Number(report?.cookies?.categories?.ads || report?.cookies?.categories?.advertising || 0),
      social: Number(report?.cookies?.categories?.social || 0),
    },
    trackerCount,
    thirdPartyCount,
    retentionShort: score >= 75 ? "Baja" : score >= 55 ? "Media" : "Alta",
    retention: baseService.retention || (report?.evidence?.retention ? sentenceCase(report.evidence.retention) : "No se identificó un plazo específico; la lectura prioriza señales visibles y persistencia técnica."),
    deletion: baseService.deletion || (report?.bullets || []).find((bullet) => /borrado|supresi|elimin/i.test(bullet)) || "Consulta la política y los ajustes de cuenta para confirmar el flujo de borrado disponible.",
    scoreBreakdown: mapBreakdown(report),
    checklist: mapChecklist(report),
    findings: mapFindings(report),
    cookieCategories: mapCookieCategories(report),
    cookies: mapCookies(report, matchedService),
    trackers: mapTrackers(report, matchedService),
    sharedWith: mapTransfers(report, matchedService),
    collectedData: mapCollectedData(report, matchedService),
    rights: mapRights(report, matchedService),
    retentionDetails: mapRetentionDetails(report, matchedService),
    transfers: mapTransfers(report, matchedService),
    termsHighlights: mapTermsHighlights(report, matchedService),
    policyLinks: {
      privacy: report?.policyUrl || baseService?.policyLinks?.privacy || report?.url || "#",
      terms: baseService?.policyLinks?.terms || report?.url || "#",
      cookies: baseService?.policyLinks?.cookies || report?.policyUrl || report?.url || "#",
    },
    browserSignals: buildBrowserSignals(report),
  };
}
