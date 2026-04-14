import { classifyCookie } from "./cookie_classifier.js";

function getCookieDays(cookie, nowSec) {
  if (typeof cookie?.expirationDate !== "number") return 0;
  return Math.max(0, (cookie.expirationDate - nowSec) / (60 * 60 * 24));
}

export async function getCookiesSummaryFromUrl(tabUrl) {
  const url = new URL(tabUrl);
  const host = url.hostname;
  const cookies = await chrome.cookies.getAll({ url: tabUrl });

  const totalCookies = cookies.length;
  const persistentCookies = cookies.filter((cookie) => typeof cookie.expirationDate === "number").length;
  const sessionCookies = totalCookies - persistentCookies;

  let thirdPartyCookies = 0;
  let firstPartyCookies = 0;
  const domainCounts = new Map();
  let maxExpDays = 0;
  const nowSec = Date.now() / 1000;

  const categoryCounts = {
    analytics: 0,
    ads: 0,
    social: 0,
    essential: 0,
    other: 0,
  };

  const sampleCookies = [];

  for (const cookie of cookies) {
    const cookieDomainRaw = (cookie.domain || "").replace(/^\./, "");
    const cookieDomain = cookieDomainRaw || host;
    const isFirstParty = host === cookieDomain || host.endsWith(`.${cookieDomain}`);
    const days = getCookieDays(cookie, nowSec);
    const category = classifyCookie(cookie);

    if (isFirstParty) firstPartyCookies += 1;
    else thirdPartyCookies += 1;

    domainCounts.set(cookieDomain, (domainCounts.get(cookieDomain) || 0) + 1);
    if (days > maxExpDays) maxExpDays = days;

    categoryCounts[category.category] = (categoryCounts[category.category] || 0) + 1;

    sampleCookies.push({
      name: cookie.name,
      domain: cookieDomain,
      category: category.category,
      reason: category.reason,
      session: typeof cookie.expirationDate !== "number",
      days: Math.round(days),
      secure: !!cookie.secure,
      httpOnly: !!cookie.httpOnly,
      sameSite: cookie.sameSite || "unspecified",
    });
  }

  const topDomains = Array.from(domainCounts.entries())
    .sort((left, right) => right[1] - left[1])
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
    categoryCounts,
    sampleCookies: sampleCookies.slice(0, 12),
  };
}

export function cookiesSummaryToText(summary) {
  if (!summary) return "No cookie summary.";

  const categories = summary.categoryCounts || {};
  const lines = [
    `host=${summary.host}`,
    `cookies_total=${summary.totalCookies}`,
    `cookies_persistentes=${summary.persistentCookies}`,
    `cookies_sesion=${summary.sessionCookies}`,
    `cookies_first_party_est=${summary.firstPartyCookies}`,
    `cookies_third_party_est=${summary.thirdPartyCookies}`,
    `max_exp_days=${summary.maxExpirationDays}`,
    `categorias_est: ads=${categories.ads || 0}, analytics=${categories.analytics || 0}, social=${categories.social || 0}, essential=${categories.essential || 0}, other=${categories.other || 0}`,
  ];

  const top = (summary.topDomains || []).map((entry) => `${entry.domain}(${entry.count})`).join(", ");
  if (top) lines.push(`top_domains=${top}`);

  return lines.join("\n");
}
