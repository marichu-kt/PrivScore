// src/background/cookies_summary.js
// Genera un resumen de cookies para la web actual usando chrome.cookies.
// Compatible con Manifest V3 (service worker).

import { classifyCookie } from "./cookie_classifier.js";

/**
 * Dado un tab URL, devuelve un resumen de cookies.
 * - totalCookies
 * - persistentCookies
 * - sessionCookies
 * - thirdPartyCookies (estimación por dominio)
 * - maxExpirationDays
 * - topDomains
 * - categories (ads/analytics/etc. aproximado)
 */
export async function getCookiesSummaryFromUrl(tabUrl) {
  const u = new URL(tabUrl);
  const host = u.hostname;

  // Usamos el filtro por URL para obtener las cookies aplicables al sitio actual.
  // Nota: esto NO incluye necesariamente cookies “de terceros” asociadas a otros dominios.
  const cookies = await chrome.cookies.getAll({ url: tabUrl });

  const totalCookies = cookies.length;
  const persistentCookies = cookies.filter(c => typeof c.expirationDate === "number").length;
  const sessionCookies = totalCookies - persistentCookies;

  // Estimar "third-party" comparando dominio cookie vs host actual
  // Nota: esto es una aproximación, porque la API no te dice “quién la puso”.
  let thirdPartyCookies = 0;
  let firstPartyCookies = 0;

  const domainCounts = new Map();
  let maxExpDays = 0;

  const categoryCounts = {
    analytics: 0,
    ads: 0,
    social: 0,
    essential: 0,
    other: 0
  };

  const nowSec = Date.now() / 1000;

  for (const c of cookies) {
    const cDomainRaw = (c.domain || "").replace(/^\./, "");
    const cDomain = cDomainRaw || host;

    // First party si el dominio de la cookie es el host o un parent domain del host
    // Ej: cookie domain "example.com" es first-party para "www.example.com"
    const isFirstParty = host === cDomain || host.endsWith("." + cDomain);
    if (isFirstParty) firstPartyCookies++;
    else thirdPartyCookies++;

    // Conteo por dominio
    domainCounts.set(cDomain, (domainCounts.get(cDomain) || 0) + 1);

    // Expiración máxima (en días)
    if (typeof c.expirationDate === "number") {
      const days = Math.max(0, (c.expirationDate - nowSec) / (60 * 60 * 24));
      if (days > maxExpDays) maxExpDays = days;
    }

    // Clasificación aproximada por nombre/dominio
    const cls = classifyCookie(c);
    categoryCounts[cls.category] = (categoryCounts[cls.category] || 0) + 1;
  }

  const topDomains = Array.from(domainCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([domain, count]) => ({ domain, count }));

  return {
    host,
    totalCookies,
    persistentCookies,
    sessionCookies,
    firstPartyCookies,
    thirdPartyCookies,
    maxExpirationDays: Math.round(maxExpDays),
    topDomains,
    categoryCounts
  };
}

/**
 * Convierte el summary en un texto breve para IA / logs.
 */
export function cookiesSummaryToText(summary) {
  if (!summary) return "No cookie summary.";

  const lines = [];
  lines.push(`host=${summary.host}`);
  lines.push(`cookies_total=${summary.totalCookies}`);
  lines.push(`cookies_persistentes=${summary.persistentCookies}`);
  lines.push(`cookies_sesion=${summary.sessionCookies}`);
  lines.push(`cookies_first_party_est=${summary.firstPartyCookies}`);
  lines.push(`cookies_third_party_est=${summary.thirdPartyCookies}`);
  lines.push(`max_exp_days=${summary.maxExpirationDays}`);

  const cats = summary.categoryCounts || {};
  lines.push(
    `categorias_est: ads=${cats.ads || 0}, analytics=${cats.analytics || 0}, social=${cats.social || 0}, essential=${cats.essential || 0}, other=${cats.other || 0}`
  );

  const tops = (summary.topDomains || []).map(d => `${d.domain}(${d.count})`).join(", ");
  if (tops) lines.push(`top_domains=${tops}`);

  return lines.join("\n");
}
