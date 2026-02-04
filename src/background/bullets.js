// src/background/bullets.js
// Bullets orientados a UX: cortos, accionables y con categorías.
// La evidencia (snippets) se muestra en la vista detalle (report.evidence).

function n(x) {
  const v = Number(x);
  return Number.isFinite(v) ? v : 0;
}

export function buildBullets(signals, _score, _grade) {
  const hits = signals?.hits || {};
  const intensity = signals?.intensity || {};
  const cookies = signals?.cookies || {};
  const page = signals?.page || {};
  const retention = signals?.retention || {};
  const partialReasons = signals?.partialReasons || [];

  const bullets = [];

  // --- Avisos de calidad del análisis ---
  if (partialReasons.length) {
    bullets.push(`⚠️ Resultado parcial: ${partialReasons[0]}`);
  }

  // --- Terceros / monetización (alta prioridad) ---
  if (hits.sale) bullets.push("🚨 Terceros: posible venta/monetización de datos.");

  if (hits.thirdParty) {
    const lvl = n(intensity.thirdParty || 1);
    bullets.push(
      lvl >= 2
        ? "👥 Terceros: compartición con partners/terceros (mencionado varias veces)."
        : "👥 Terceros: comparte datos con terceros/partners."
    );
  }

  if (hits.intlTransfers) bullets.push("🌍 Terceros: posibles transferencias internacionales de datos.");

  // --- Trackers / técnico ---
  const ext = page.external || {};
  const tpDomains = n(ext.thirdPartyDomains);
  const tpResources = n(ext.thirdPartyResources);
  const extCats = ext.categoryCounts || {};

  if (hits.fingerprinting || ext.possibleFingerprinting) bullets.push("🧩 Trackers: indicios de fingerprinting.");

  if (tpDomains >= 2) bullets.push(`🧩 Trackers: recursos de terceros detectados (${tpDomains} dominios).`);
  else if (tpResources >= 3) bullets.push(`🧩 Trackers: varios recursos externos detectados (${tpResources}).`);

  if ((extCats.ads || 0) > 0) bullets.push(`📣 Trackers: presencia de publicidad/ads (${n(extCats.ads)}).`);
  if ((extCats.analytics || 0) > 0) bullets.push(`📈 Trackers: presencia de analítica (${n(extCats.analytics)}).`);

  const st = page.storage || {};
  const trackingKeys = n(st.trackingKeysCount);
  if (hits.storageTracking || trackingKeys >= 2) bullets.push(`💾 Trackers: claves de tracking en storage (${trackingKeys}).`);

  const consent = page.consent || {};
  if (consent.detected && consent.hasAccept && !consent.hasReject) bullets.push("🧾 Consentimiento: banner sin opción clara de rechazar.");
  else if (consent.detected && consent.hasReject) bullets.push("✅ Consentimiento: permite rechazar/gestionar cookies.");

  // --- Cookies ---
  const totalCookies = n(cookies.totalCookies);
  const persistentCookies = n(cookies.persistentCookies);
  const thirdPartyCookies = n(cookies.thirdPartyCookies);
  const cats = cookies.categoryCounts || null;

  if (cookies.manyCookies) bullets.push(`🍪 Cookies: muchas cookies detectadas (${totalCookies}).`);
  else if (totalCookies > 0) bullets.push(`🍪 Cookies: ${totalCookies} detectadas.`);

  if (cookies.manyPersistent) bullets.push(`🕒 Cookies: varias persistentes (${persistentCookies}).`);
  if (thirdPartyCookies >= 4) bullets.push(`🧩 Cookies: estimación de terceros (${thirdPartyCookies}).`);

  if (cats) {
    if (n(cats.ads) >= 2) bullets.push(`📣 Cookies: asociadas a ads (${n(cats.ads)}).`);
    if (n(cats.analytics) >= 3) bullets.push(`📈 Cookies: asociadas a analítica (${n(cats.analytics)}).`);
  }

  // --- Perfilado / ads (legal) ---
  if (hits.ads) {
    const lvl = n(intensity.ads || 1);
    bullets.push(lvl >= 2 ? "🎯 Perfilado: indicios fuertes de publicidad personalizada/tracking." : "🎯 Perfilado: indicios de publicidad personalizada/tracking.");
  }

  // --- Retención ---
  if (hits.retentionBad) bullets.push("🕒 Retención: indefinida o poco clara (sin plazos).");
  else if (typeof retention.days === "number") {
    if (retention.days <= 90) bullets.push("🕒 Retención: plazo corto y claro.");
    else if (retention.days <= 365) bullets.push("🕒 Retención: plazo moderado y claro.");
    else bullets.push("🕒 Retención: plazo largo.");
  }

  // --- Derechos ---
  if (hits.rights) bullets.push("🧾 Derechos: menciona acceso/borrado/portabilidad u otros derechos.");
  else if (!partialReasons.length) bullets.push("🧾 Derechos: no se mencionan claramente derechos del usuario.");

  if (bullets.length === 0) bullets.push("No se detectaron señales claras (puede faltar texto legal).");

  // Dedup
  const seen = new Set();
  return bullets.filter(b => {
    const k = String(b);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
