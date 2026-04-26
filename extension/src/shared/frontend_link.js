export const DEFAULT_FRONTEND_BASE_URL = "https://marichu-kt.github.io/PrivScore/";

function normalizeBaseUrl(input = DEFAULT_FRONTEND_BASE_URL) {
  const raw = String(input || DEFAULT_FRONTEND_BASE_URL).trim() || DEFAULT_FRONTEND_BASE_URL;
  const url = new URL(raw);
  url.search = "";
  url.hash = "";
  return url;
}

function normalizeHostname(value = "") {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return raw
      .replace(/^https?:\/\//i, "")
      .split(/[/?#]/)[0]
      .replace(/^www\./, "");
  }
}

function getReportHostname(report = {}) {
  const fromHost = normalizeHostname(report.host);
  if (fromHost) return fromHost;

  const fromUrl = normalizeHostname(report.url);
  if (fromUrl) return fromUrl;

  const fromPolicy = normalizeHostname(report.policyUrl);
  if (fromPolicy) return fromPolicy;

  return "";
}

function getRegistrableDomain(hostname = "") {
  const cleanHost = normalizeHostname(hostname);
  if (!cleanHost) return "";

  const parts = cleanHost.split(".").filter(Boolean);
  if (parts.length <= 2) return cleanHost;

  const twoPartSuffixes = new Set([
    "com.ar",
    "com.au",
    "com.br",
    "com.co",
    "com.es",
    "com.mx",
    "com.tr",
    "co.jp",
    "co.kr",
    "co.uk",
    "co.nz",
    "org.uk",
    "ac.uk",
    "gov.uk",
  ]);

  const lastTwo = parts.slice(-2).join(".");
  if (twoPartSuffixes.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

function slugify(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


function getHardcodedServiceSlug(report = {}, hostname = "", domain = "") {
  const host = normalizeHostname(hostname);
  const registrableDomain = normalizeHostname(domain);
  const url = String(report?.url || "").toLowerCase();
  const policyUrl = String(report?.policyUrl || "").toLowerCase();
  const pageTitle = String(report?.pageTitle || "").toLowerCase();
  const rawHost = String(report?.host || "").toLowerCase();
  const combined = `${rawHost} ${host} ${registrableDomain} ${url} ${policyUrl} ${pageTitle}`;

  // Caso especial: Azure suele redirigir a dominios de Microsoft
  // como azure.microsoft.com, lo que generaría microsoft-microsoft-com.
  // Para la ficha editorial del catálogo queremos abrir azure-azure-com.
  const isAzure =
    host === "azure.com" ||
    host.endsWith(".azure.com") ||
    host === "azure.microsoft.com" ||
    host.endsWith(".azure.microsoft.com") ||
    combined.includes("azure.com") ||
    combined.includes("azure.microsoft.com") ||
    combined.includes("/azure") ||
    /(^|[^a-z0-9])azure([^a-z0-9]|$)/.test(pageTitle);

  if (isAzure) return "azure-azure-com";

  return "";
}

function getDomainLabel(domain = "") {
  const parts = String(domain || "").split(".").filter(Boolean);
  return parts[0] || "servicio";
}

export function buildCatalogServiceSlug(report = {}) {
  const hostname = getReportHostname(report);
  const domain = getRegistrableDomain(hostname);
  const hardcodedSlug = getHardcodedServiceSlug(report, hostname, domain);

  if (hardcodedSlug) return hardcodedSlug;
  if (!domain) return "";

  const domainLabel = getDomainLabel(domain);
  return slugify(`${domainLabel}-${domain}`);
}

export function buildFrontendDetailUrl(baseUrl, report = {}) {
  const url = normalizeBaseUrl(baseUrl);
  const serviceSlug = buildCatalogServiceSlug(report);

  if (serviceSlug) {
    url.hash = `/services/${serviceSlug}`;
    return url.toString();
  }

  url.hash = "/";
  return url.toString();
}
