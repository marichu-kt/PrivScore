// src/background/weights.js
// Pesos/umbrales del scoring determinista.

export const GRADE_THRESHOLDS = {
  A: 80,
  B: 65,
  C: 50,
  D: 35
};

export const COLORS = {
  A: "#1a7f37",
  B: "#2ea44f",
  C: "#c69000",
  D: "#d65a00",
  E: "#b42318",
  DEFAULT: "#6b7280"
};

// Secciones (suman 100 para que el score final sea la suma directa)
export const SECTION_MAX = {
  trackers: 40,
  thirdParties: 25,
  retention: 15,
  rights: 20
};

export const WEIGHTS = {
  // Trackers / técnico
  trackers: {
    manyCookies: 10,
    manyPersistent: 10,
    manyThirdPartyCookies: 6,
    adsCookies: 6,
    analyticsCookies: 4,

    thirdPartyDomainsLow: 3,
    thirdPartyDomainsMed: 6,
    thirdPartyDomainsHigh: 10,

    adsSignals: 6,
    adsSignalsPerLevel: 2,

    fingerprinting: 10,
    storageTracking: 6,

    cmpNoReject: 4,
    cmpHasRejectBonus: 2,

    lowCookieBonus: 2
  },

  // Terceros / monetización
  thirdParties: {
    sale: 20,
    thirdPartyBase: 8,
    thirdPartyPerLevel: 2,
    intlTransfers: 4
  },

  // Retención
  retention: {
    vague: 8,
    long365: 4,
    long90: 2,
    long30: 1,
    shortBonus: 2
  },

  // Derechos
  rights: {
    missing: 8,
    presentBonus: 2
  },

  thresholds: {
    manyCookies: 12,
    manyPersistent: 6,
    manyThirdPartyCookies: 4,
    adsCookies: 2,
    analyticsCookies: 3,
    lowCookies: 4,

    tpDomainsMed: 3,
    tpDomainsHigh: 6,
    trackingKeys: 2
  },

  maxBullets: 10
};
