function n(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function buildBullets(signals, _score, _grade) {
  const hits = signals?.hits || {};
  const intensity = signals?.intensity || {};
  const cookies = signals?.cookies || {};
  const page = signals?.page || {};
  const retention = signals?.retention || {};
  const partialReasons = signals?.partialReasons || [];
  const bullets = [];

  if (partialReasons.length) {
    bullets.push(`⚠️ Resultado parcial: ${partialReasons[0]}`);
  }

  if (hits.sale) bullets.push("🚨 Terceros: posible venta o monetización de datos.");

  if (hits.thirdParty) {
    const level = n(intensity.thirdParty || 1);
    bullets.push(
      level >= 2
        ? "👥 Terceros: compartición con partners o terceros mencionada varias veces."
        : "👥 Terceros: comparte datos con terceros o partners."
    );
  }

  if (hits.intlTransfers) bullets.push("🌍 Terceros: posibles transferencias internacionales de datos.");

  const external = page.external || {};
  const thirdPartyDomains = n(external.thirdPartyDomains);
  const thirdPartyResources = n(external.thirdPartyResources);
  const externalCategories = external.categoryCounts || {};

  if (hits.fingerprinting || external.possibleFingerprinting) {
    bullets.push("🧩 Trackers: indicios de fingerprinting.");
  }

  if (thirdPartyDomains >= 2) bullets.push(`🧩 Trackers: recursos de terceros detectados (${thirdPartyDomains} dominios).`);
  else if (thirdPartyResources >= 3) bullets.push(`🧩 Trackers: varios recursos externos detectados (${thirdPartyResources}).`);

  if ((externalCategories.ads || 0) > 0) bullets.push(`📣 Trackers: presencia de publicidad o ads (${n(externalCategories.ads)}).`);
  if ((externalCategories.analytics || 0) > 0) bullets.push(`📈 Trackers: presencia de analítica (${n(externalCategories.analytics)}).`);

  const storage = page.storage || {};
  const trackingKeys = n(storage.trackingKeysCount);
  if (hits.storageTracking || trackingKeys >= 2) {
    bullets.push(`💾 Trackers: claves de tracking en storage (${trackingKeys}).`);
  }

  const consent = page.consent || {};
  if (consent.detected && consent.hasAccept && !consent.hasReject) {
    bullets.push("🧾 Consentimiento: banner sin opción clara de rechazar.");
  } else if (consent.detected && consent.hasReject) {
    bullets.push("✅ Consentimiento: permite rechazar o gestionar cookies.");
  }

  const totalCookies = n(cookies.totalCookies);
  const persistentCookies = n(cookies.persistentCookies);
  const thirdPartyCookies = n(cookies.thirdPartyCookies);
  const categories = cookies.categoryCounts || null;

  if (cookies.manyCookies) bullets.push(`🍪 Cookies: muchas cookies detectadas (${totalCookies}).`);
  else if (totalCookies > 0) bullets.push(`🍪 Cookies: ${totalCookies} detectadas.`);

  if (cookies.manyPersistent) bullets.push(`🕒 Cookies: varias persistentes (${persistentCookies}).`);
  if (thirdPartyCookies >= 4) bullets.push(`🧩 Cookies: estimación de terceros (${thirdPartyCookies}).`);

  if (categories) {
    if (n(categories.ads) >= 2) bullets.push(`📣 Cookies: asociadas a ads (${n(categories.ads)}).`);
    if (n(categories.analytics) >= 3) bullets.push(`📈 Cookies: asociadas a analítica (${n(categories.analytics)}).`);
  }

  if (hits.ads) {
    const level = n(intensity.ads || 1);
    bullets.push(
      level >= 2
        ? "🎯 Perfilado: indicios fuertes de publicidad personalizada o tracking."
        : "🎯 Perfilado: indicios de publicidad personalizada o tracking."
    );
  }

  if (hits.retentionBad) bullets.push("🕒 Retención: indefinida o poco clara (sin plazos)." );
  else if (typeof retention.days === "number") {
    if (retention.days <= 90) bullets.push("🕒 Retención: plazo corto y claro.");
    else if (retention.days <= 365) bullets.push("🕒 Retención: plazo moderado y claro.");
    else bullets.push("🕒 Retención: plazo largo.");
  }

  if (hits.rights) bullets.push("🧾 Derechos: menciona acceso, borrado, portabilidad u otros derechos.");
  else if (!partialReasons.length) bullets.push("🧾 Derechos: no se mencionan claramente derechos del usuario.");

  if (!bullets.length) bullets.push("No se detectaron señales claras; puede faltar texto legal visible.");

  const seen = new Set();
  return bullets.filter((bullet) => {
    const key = String(bullet);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
