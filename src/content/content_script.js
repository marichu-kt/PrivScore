// src/content/content_script.js
// Encuentra enlaces a política de privacidad / cookies / términos y recoge señales técnicas del DOM.

(function () {
  if (window.__PRIVSCORE_CONTENT_LOADED__) return;
  window.__PRIVSCORE_CONTENT_LOADED__ = true;

  const KEYWORDS = [
    // Privacidad
    "privacy", "privacidad", "privacy policy", "política de privacidad", "politica de privacidad",
    // Cookies
    "cookies", "cookie policy", "política de cookies", "politica de cookies",
    // Términos / legal
    "terms", "términos", "terminos", "terms of service", "terms & conditions",
    "condiciones", "condiciones de uso", "aviso legal", "legal", "legal notice", "imprint"
  ];

  const STRONG = [
    "privacy", "privacidad", "cookies", "cookie policy", "política de privacidad", "política de cookies",
    "terms", "términos", "aviso legal"
  ];

  const PATH_HINTS = [
    "/privacy", "/privacy-policy", "/privacy_policy", "/privacidad",
    "/cookies", "/cookie-policy", "/cookie_policy",
    "/terms", "/terms-of-service", "/terms-and-conditions",
    "/legal", "/legal-notice", "/aviso-legal", "/imprint", "/gdpr", "/rgpd"
  ];

  function norm(s) {
    return (s || "").toString().replace(/\s+/g, " ").trim().toLowerCase();
  }

  function scoreLink(text, href) {
    const hay = `${text} ${href}`.toLowerCase();
    let score = 0;

    for (const kw of KEYWORDS) if (hay.includes(kw)) score += 2;
    for (const sk of STRONG) if (hay.includes(sk)) score += 3;

    try {
      const u = new URL(href, window.location.href);
      const p = (u.pathname || "").toLowerCase();
      for (const ph of PATH_HINTS) if (p.includes(ph)) score += 4;
      if (u.hostname === window.location.hostname) score += 2;
    } catch (_) {}

    if (href.startsWith("javascript:")) score -= 10;
    if (href.startsWith("#")) score -= 5;

    return score;
  }

  function getElementContext(el) {
    const parent = el.closest("footer, nav, header, main, aside, section, div");
    const tag = parent ? parent.tagName.toLowerCase() : "unknown";
    const id = parent?.id ? `#${parent.id}` : "";
    const cls = parent?.className ? `.${String(parent.className).split(/\s+/).slice(0, 2).join(".")}` : "";
    return `${tag}${id}${cls}`;
  }

  function findCandidateLinks() {
    const anchors = Array.from(document.querySelectorAll("a[href]"));
    const candidates = [];

    for (const a of anchors) {
      const text = norm(a.innerText || a.getAttribute("aria-label") || a.title || "");
      const hrefRaw = a.getAttribute("href") || "";
      const href = a.href || hrefRaw;

      if (!href) continue;

      const hay = `${text} ${href}`.toLowerCase();
      if (!KEYWORDS.some((k) => hay.includes(k))) continue;

      const score = scoreLink(text, href);
      if (score <= 0) continue;

      candidates.push({
        text: text || "(sin texto)",
        href,
        score,
        context: getElementContext(a)
      });
    }

    const map = new Map();
    for (const c of candidates) {
      const prev = map.get(c.href);
      if (!prev || c.score > prev.score) map.set(c.href, c);
    }

    return Array.from(map.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }

  // --- Señales técnicas del DOM ---
  function getDomain(u) {
    try { return new URL(u, location.href).hostname; } catch (_) { return ""; }
  }

  function categorizeDomain(domain) {
    const d = domain.toLowerCase();
    const is = (s) => d.includes(s);

    // ads
    if (is("doubleclick") || is("googlesyndication") || is("adservice") || is("adsystem") || is("taboola") || is("outbrain") || is("criteo") || is("adnxs") || is("rubicon")) return "ads";
    // analytics
    if (is("google-analytics") || is("googletagmanager") || is("segment") || is("mixpanel") || is("amplitude") || is("hotjar") || is("fullstory") || is("clarity") || is("datadog") || is("newrelic")) return "analytics";
    // social
    if (is("facebook") || is("fbcdn") || is("twitter") || is("tiktok") || is("linkedin") || is("instagram") || is("pinterest") || is("snapchat")) return "social";
    return "other";
  }

  function maybeFingerprintingFromUrl(u) {
    const s = String(u || "").toLowerCase();
    return /(fingerprint|fpjs|canvas|audiofinger|deviceid|fonts|webrtc|evercookie)/i.test(s);
  }

  function collectExternalSignals() {
    const host = location.hostname;
    const urls = [];

    const pushAttr = (sel, attr) => {
      for (const el of document.querySelectorAll(sel)) {
        const v = el.getAttribute(attr);
        if (v) urls.push(v);
      }
    };

    pushAttr("script[src]", "src");
    pushAttr("img[src]", "src");
    pushAttr("iframe[src]", "src");
    pushAttr("link[href]", "href");
    // preconnect/dns-prefetch
    pushAttr('link[rel="preconnect"][href]', "href");
    pushAttr('link[rel="dns-prefetch"][href]', "href");

    const domainCounts = new Map();
    const categoryCounts = { ads: 0, analytics: 0, social: 0, other: 0 };

    let thirdPartyResources = 0;
    let possibleFingerprinting = false;

    for (const u of urls) {
      const dom = getDomain(u);
      if (!dom) continue;
      const isFirstParty = dom === host || dom.endsWith("." + host) || host.endsWith("." + dom);
      if (!isFirstParty) {
        thirdPartyResources++;
        domainCounts.set(dom, (domainCounts.get(dom) || 0) + 1);
        const cat = categorizeDomain(dom);
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        if (maybeFingerprintingFromUrl(u)) possibleFingerprinting = true;
      }
    }

    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([domain, count]) => ({ domain, count, category: categorizeDomain(domain) }));

    return {
      thirdPartyDomains: domainCounts.size,
      thirdPartyResources,
      topDomains,
      categoryCounts,
      possibleFingerprinting
    };
  }

  function collectStorageSignals() {
    const localKeys = [];
    const sessionKeys = [];

    try {
      for (let i = 0; i < localStorage.length; i++) localKeys.push(localStorage.key(i));
    } catch (_) {}

    try {
      for (let i = 0; i < sessionStorage.length; i++) sessionKeys.push(sessionStorage.key(i));
    } catch (_) {}

    const trackRe = /(ga_|_ga|gid|fbp|fbc|gcl_|amp_|mp_|mixpanel|segment|intercom|optimizely|hotjar|clarity|analytics|utm|pixel|tracking|consent|tcf)/i;

    const all = [...localKeys, ...sessionKeys].filter(Boolean);
    const tracking = all.filter((k) => trackRe.test(String(k || "")));
    const sample = tracking.slice(0, 10).map((k) => String(k));

    return {
      localKeysCount: localKeys.length,
      sessionKeysCount: sessionKeys.length,
      trackingKeysCount: tracking.length,
      trackingKeysSample: sample
    };
  }

  function detectConsent() {
    const w = window;
    let provider = "";
    let detected = false;

    if (typeof w.__tcfapi === "function") { detected = true; provider = provider || "TCF"; }
    if (typeof w.__uspapi === "function") { detected = true; provider = provider || "US Privacy"; }
    if (w.OneTrust || w.Optanon) { detected = true; provider = provider || "OneTrust"; }
    if (w.Cookiebot) { detected = true; provider = provider || "Cookiebot"; }
    if (w.didomiOnReady || w.Didomi) { detected = true; provider = provider || "Didomi"; }
    if (w.UC_UI || w.Usercentrics) { detected = true; provider = provider || "Usercentrics"; }

    const btnText = (el) => norm(el?.innerText || el?.getAttribute("aria-label") || el?.title || "");
    const buttons = Array.from(document.querySelectorAll("button, a[role=button], input[type=button], input[type=submit]")).slice(0, 250);

    let hasAccept = false;
    let hasReject = false;

    for (const b of buttons) {
      const tx = btnText(b);
      if (!tx) continue;
      if (/accept|agree|aceptar|de acuerdo|allow all|accept all|permitir|ok/i.test(tx)) hasAccept = true;
      if (/reject|decline|no aceptar|rechazar|deny|refuse|reject all|only necessary|solo necesarias/i.test(tx)) hasReject = true;
    }

    // Heurística DOM: contenedores típicos
    const banner = document.querySelector("[id*=cookie i],[class*=cookie i],[id*=consent i],[class*=consent i]");
    if (banner) { detected = true; if (!provider) provider = "banner"; }

    return { detected, provider, hasAccept, hasReject };
  }

  function buildPageSignals() {
    return {
      external: collectExternalSignals(),
      storage: collectStorageSignals(),
      consent: detectConsent()
    };
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "FIND_POLICY_LINKS") {
      try {
        const links = findCandidateLinks();

        let fallbacks = [];
        if (links.length === 0) {
          const origin = window.location.origin;
          fallbacks = ["/privacy", "/privacy-policy", "/cookies", "/cookie-policy", "/terms", "/legal", "/aviso-legal"].map((p) => ({
            text: "(ruta típica)",
            href: origin + p,
            score: 1,
            context: "fallback"
          }));
        }

        sendResponse({
          pageUrl: window.location.href,
          pageTitle: document.title || "",
          links,
          fallbacks,
          pageSignals: buildPageSignals()
        });
      } catch (e) {
        sendResponse({ links: [], fallbacks: [], pageSignals: {}, error: String(e) });
      }
      return true;
    }
  });
})();
