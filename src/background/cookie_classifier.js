
// src/background/cookie_classifier.js
// Clasificación aproximada por nombre/dominio (heurística).
// No es perfecto, pero sirve para scoring y bullets.

const DOMAIN_HINTS = {
  analytics: [
    "google-analytics.com",
    "analytics.google.com",
    "googletagmanager.com",
    "doubleclick.net", // a veces ads/measurement
    "mixpanel.com",
    "segment.com",
    "amplitude.com",
    "hotjar.com"
  ],
  ads: [
    "doubleclick.net",
    "googleads.g.doubleclick.net",
    "adservice.google.com",
    "googlesyndication.com",
    "adsystem.com",
    "criteo.com",
    "taboola.com",
    "outbrain.com"
  ],
  social: [
    "facebook.com",
    "fb.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "tiktok.com",
    "linkedin.com"
  ]
};

const NAME_HINTS = {
  analytics: [
    /^_ga/i,
    /^_gid/i,
    /^_gat/i,
    /^_gcl_/i,
    /^amplitude/i,
    /^mp_/i,
    /^mixpanel/i,
    /^hj/i // hotjar
  ],
  ads: [
    /^_gcl_/i,
    /^IDE$/i,
    /^test_cookie$/i,
    /^fr$/i
  ],
  essential: [
    /csrf/i,
    /session/i,
    /sid/i,
    /auth/i,
    /token/i
  ]
};

function domainHasAny(domain, list) {
  const d = (domain || "").replace(/^\./, "").toLowerCase();
  return list.some(h => d === h || d.endsWith("." + h) || d.includes(h));
}

function nameMatchesAny(name, list) {
  const n = (name || "").toLowerCase();
  return list.some(re => re.test ? re.test(n) : n.includes(String(re).toLowerCase()));
}

/**
 * @param {chrome.cookies.Cookie} cookie
 * @returns {{category: "analytics"|"ads"|"social"|"essential"|"other", reason: string}}
 */
export function classifyCookie(cookie) {
  const domain = (cookie?.domain || "").replace(/^\./, "").toLowerCase();
  const name = (cookie?.name || "").toLowerCase();

  if (domainHasAny(domain, DOMAIN_HINTS.ads) || nameMatchesAny(name, NAME_HINTS.ads)) {
    return { category: "ads", reason: "domain/name hint ads" };
  }
  if (domainHasAny(domain, DOMAIN_HINTS.analytics) || nameMatchesAny(name, NAME_HINTS.analytics)) {
    return { category: "analytics", reason: "domain/name hint analytics" };
  }
  if (domainHasAny(domain, DOMAIN_HINTS.social)) {
    return { category: "social", reason: "domain hint social" };
  }
  if (nameMatchesAny(name, NAME_HINTS.essential) || cookie?.httpOnly || cookie?.secure) {
    // Heurística: httpOnly/secure suele ser sesión/auth, pero no siempre.
    return { category: "essential", reason: "name/security hint essential" };
  }
  return { category: "other", reason: "no hints" };
}
