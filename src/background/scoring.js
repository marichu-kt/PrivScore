// src/background/scoring.js
// Scoring determinista por secciones (suman 100) + letra + color.
// La IA (si se usa) SOLO afecta a la extracción de señales; nunca decide la letra.

import { SECTION_MAX, WEIGHTS, GRADE_THRESHOLDS, COLORS } from "./weights.js";
import { buildBullets } from "./bullets.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function gradeFromScore(score) {
  if (score >= GRADE_THRESHOLDS.A) return "A";
  if (score >= GRADE_THRESHOLDS.B) return "B";
  if (score >= GRADE_THRESHOLDS.C) return "C";
  if (score >= GRADE_THRESHOLDS.D) return "D";
  return "E";
}

function colorFromGrade(grade) {
  return COLORS[grade] || COLORS.DEFAULT;
}

export function computeScoreFromSignals(signals) {
  const hits = signals?.hits || {};
  const intensity = signals?.intensity || {};
  const cookies = signals?.cookies || {};
  const page = signals?.page || {};
  const retention = signals?.retention || {};
  const confidence = Number.isFinite(signals?.confidence) ? signals.confidence : 0.55;
  const partialReasons = Array.isArray(signals?.partialReasons) ? signals.partialReasons : [];

  // --- Trackers section ---
  let trackers = SECTION_MAX.trackers;

  const total = Number(cookies.totalCookies || 0);
  const persistent = Number(cookies.persistentCookies || 0);
  const thirdPartyCookies = Number(cookies.thirdPartyCookies || 0);
  const cats = cookies.categoryCounts || null;

  const manyCookies = cookies.manyCookies ?? (total >= WEIGHTS.thresholds.manyCookies);
  const manyPersistent = cookies.manyPersistent ?? (persistent >= WEIGHTS.thresholds.manyPersistent);

  if (manyCookies) trackers -= WEIGHTS.trackers.manyCookies;
  if (manyPersistent) trackers -= WEIGHTS.trackers.manyPersistent;

  if (thirdPartyCookies >= WEIGHTS.thresholds.manyThirdPartyCookies) {
    trackers -= WEIGHTS.trackers.manyThirdPartyCookies;
  }

  if (cats) {
    if ((cats.ads || 0) >= WEIGHTS.thresholds.adsCookies) trackers -= WEIGHTS.trackers.adsCookies;
    if ((cats.analytics || 0) >= WEIGHTS.thresholds.analyticsCookies) trackers -= WEIGHTS.trackers.analyticsCookies;
  }

  const ext = page.external || {};
  const tpDomains = Number(ext.thirdPartyDomains || 0);
  if (tpDomains >= WEIGHTS.thresholds.tpDomainsHigh) trackers -= WEIGHTS.trackers.thirdPartyDomainsHigh;
  else if (tpDomains >= WEIGHTS.thresholds.tpDomainsMed) trackers -= WEIGHTS.trackers.thirdPartyDomainsMed;
  else if (tpDomains >= 1) trackers -= WEIGHTS.trackers.thirdPartyDomainsLow;

  // Ads/tracking legal
  if (hits.ads) {
    const lvl = clamp(Number(intensity.ads || 1), 1, 3);
    trackers -= WEIGHTS.trackers.adsSignals + WEIGHTS.trackers.adsSignalsPerLevel * lvl;
  }

  // Fingerprinting / storage tracking
  if (hits.fingerprinting || ext.possibleFingerprinting) trackers -= WEIGHTS.trackers.fingerprinting;

  const st = page.storage || {};
  if (hits.storageTracking || Number(st.trackingKeysCount || 0) >= WEIGHTS.thresholds.trackingKeys) {
    trackers -= WEIGHTS.trackers.storageTracking;
  }

  // Consent banner
  const consent = page.consent || {};
  if (consent.detected && consent.hasAccept && !consent.hasReject) trackers -= WEIGHTS.trackers.cmpNoReject;
  if (consent.detected && consent.hasReject) trackers += WEIGHTS.trackers.cmpHasRejectBonus;

  // bonus pocas cookies (solo si hay alguna)
  if (total > 0 && total <= WEIGHTS.thresholds.lowCookies) trackers += WEIGHTS.trackers.lowCookieBonus;

  trackers = clamp(Math.round(trackers), 0, SECTION_MAX.trackers);

  // --- Third parties section ---
  let thirdParties = SECTION_MAX.thirdParties;
  if (hits.sale) thirdParties -= WEIGHTS.thirdParties.sale;

  if (hits.thirdParty) {
    const lvl = clamp(Number(intensity.thirdParty || 1), 1, 3);
    thirdParties -= WEIGHTS.thirdParties.thirdPartyBase + WEIGHTS.thirdParties.thirdPartyPerLevel * lvl;
  }

  if (hits.intlTransfers) thirdParties -= WEIGHTS.thirdParties.intlTransfers;

  thirdParties = clamp(Math.round(thirdParties), 0, SECTION_MAX.thirdParties);

  // --- Retention section ---
  let retentionScore = SECTION_MAX.retention;

  if (hits.retentionBad) retentionScore -= WEIGHTS.retention.vague;

  if (typeof retention.days === "number") {
    if (retention.days > 365) retentionScore -= WEIGHTS.retention.long365;
    else if (retention.days > 90) retentionScore -= WEIGHTS.retention.long90;
    else if (retention.days > 30) retentionScore -= WEIGHTS.retention.long30;
    else retentionScore += WEIGHTS.retention.shortBonus;
  }

  retentionScore = clamp(Math.round(retentionScore), 0, SECTION_MAX.retention);

  // --- Rights section ---
  let rights = SECTION_MAX.rights;

  if (!hits.rights && partialReasons.length === 0) rights -= WEIGHTS.rights.missing;
  if (hits.rights) rights += WEIGHTS.rights.presentBonus;

  rights = clamp(Math.round(rights), 0, SECTION_MAX.rights);

  const score = clamp(trackers + thirdParties + retentionScore + rights, 0, 100);
  const grade = gradeFromScore(score);
  const colorHex = colorFromGrade(grade);

  const estimated = partialReasons.length > 0 || confidence < 0.45;

  const bullets = buildBullets(
    {
      hits,
      intensity,
      cookies: {
        ...cookies,
        totalCookies: total,
        persistentCookies: persistent,
        thirdPartyCookies,
        manyCookies,
        manyPersistent
      },
      page,
      retention,
      partialReasons
    },
    score,
    grade
  ).slice(0, WEIGHTS.maxBullets);

  const breakdown = {
    trackers: { score: trackers, outOf: SECTION_MAX.trackers },
    thirdParties: { score: thirdParties, outOf: SECTION_MAX.thirdParties },
    retention: { score: retentionScore, outOf: SECTION_MAX.retention },
    rights: { score: rights, outOf: SECTION_MAX.rights }
  };

  return {
    score,
    grade,
    colorHex,
    bullets,
    breakdown,
    confidence: clamp(confidence, 0, 1),
    estimated
  };
}
