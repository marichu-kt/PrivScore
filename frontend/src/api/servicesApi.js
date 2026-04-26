import * as catalogServicesModule from "../data/catalogServices";
import * as servicesMockModule from "../data/services.mock";

const catalogServices = catalogServicesModule.catalogServices || catalogServicesModule.default || [];
const servicesMock = servicesMockModule.servicesMock || servicesMockModule.default || [];

const USE_BACKEND = false;

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function decodeValue(value = "") {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
}

function normalizeDomain(value = "") {
  const decoded = decodeValue(value).trim().toLowerCase();
  if (!decoded) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(decoded) ? decoded : `https://${decoded}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return decoded
      .replace(/^https?:\/\//i, "")
      .split(/[/?#]/)[0]
      .replace(/^www\./, "");
  }
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

function isSameDomainOrSubdomain(hostname, serviceDomain) {
  if (!hostname || !serviceDomain) return false;
  return hostname === serviceDomain || hostname.endsWith(`.${serviceDomain}`);
}

function getDomainSlug(domain = "") {
  return slugify(normalizeDomain(domain));
}

function findLocalServiceByIdOrDomain(id) {
  const decodedId = decodeValue(id).trim();
  const normalizedLookupDomain = normalizeDomain(decodedId);
  const slugifiedLookup = slugify(decodedId);

  const exactById = catalogServices.find((item) => item._id === decodedId || item._id === slugifiedLookup);
  if (exactById) return exactById;

  const exactByDomain = catalogServices.find((item) => normalizeDomain(item.domain) === normalizedLookupDomain);
  if (exactByDomain) return exactByDomain;

  const byDomainSlug = catalogServices.find((item) => getDomainSlug(item.domain) === slugifiedLookup);
  if (byDomainSlug) return byDomainSlug;

  const byCanonicalSlugDomainSuffix = catalogServices.find((item) => {
    const domainSlug = getDomainSlug(item.domain);
    return domainSlug && (slugifiedLookup === domainSlug || slugifiedLookup.endsWith(`-${domainSlug}`));
  });
  if (byCanonicalSlugDomainSuffix) return byCanonicalSlugDomainSuffix;

  const servicesBySpecificDomain = [...catalogServices].sort((a, b) => {
    return normalizeDomain(b.domain).length - normalizeDomain(a.domain).length;
  });

  return servicesBySpecificDomain.find((item) => {
    return isSameDomainOrSubdomain(normalizedLookupDomain, normalizeDomain(item.domain));
  });
}

function titleCaseFromSlug(value = "") {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseGeneratedServiceId(id = "") {
  const slug = slugify(decodeValue(id));
  const parts = slug.split("-").filter(Boolean);

  if (parts.length < 2) {
    const fallbackName = titleCaseFromSlug(slug || "Servicio");
    return {
      name: fallbackName,
      domain: slug ? `${slug}.com` : "servicio.com",
    };
  }

  const twoPartSuffixes = new Set([
    "com-ar",
    "com-au",
    "com-br",
    "com-co",
    "com-es",
    "com-mx",
    "com-tr",
    "co-jp",
    "co-kr",
    "co-uk",
    "co-nz",
    "org-uk",
    "ac-uk",
    "gov-uk",
  ]);

  const lastTwo = parts.slice(-2).join("-");
  const usesTwoPartSuffix = twoPartSuffixes.has(lastTwo) && parts.length >= 3;
  const domainParts = usesTwoPartSuffix ? parts.slice(-3) : parts.slice(-2);
  const nameParts = parts.slice(0, Math.max(1, parts.length - domainParts.length));

  return {
    name: titleCaseFromSlug(nameParts.join("-")) || titleCaseFromSlug(domainParts[0]),
    domain: domainParts.join("."),
  };
}

function makePolicyLinks(domain) {
  const base = domain.startsWith("http") ? domain : `https://${domain}`;
  return {
    privacy: `${base}/privacy`,
    terms: `${base}/terms`,
    cookies: `${base}/cookies`,
  };
}

function makeFallbackService(id) {
  const { name, domain } = parseGeneratedServiceId(id);
  const template = cloneValue(servicesMock.find((service) => service.rating === "C") || servicesMock[0] || {});

  return {
    ...template,
    _id: slugify(`${name}-${domain}`),
    rank: null,
    name,
    domain,
    category: "Servicios web",
    rating: "C",
    score: 65,
    location: "Global",
    reviewStatus: "Ficha generada",
    updatedAt: new Date().toISOString(),
    tagline: `${name} dentro de servicios web con una lectura orientativa sobre privacidad, terceros y controles visibles.`,
    summary: `No hay una ficha editorial específica para ${name} en el catálogo. Se muestra una ficha orientativa para evitar romper el flujo desde la extensión.`,
    privacyHighlights: ["Ficha orientativa", "Revisión pendiente", name],
    policyLinks: makePolicyLinks(domain),
  };
}

export async function getServices({ q = "", rating = "", category = "" } = {}) {
  if (!USE_BACKEND) {
    const qq = q.trim().toLowerCase();

    return catalogServices.filter((service) => {
      const matchesText =
        !qq ||
        service.name.toLowerCase().includes(qq) ||
        service.domain.toLowerCase().includes(qq) ||
        service.category.toLowerCase().includes(qq);

      const matchesRating = !rating || service.rating === rating;
      const matchesCategory = !category || service.category === category;

      return matchesText && matchesRating && matchesCategory;
    });
  }

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (rating) params.set("rating", rating);
  if (category) params.set("category", category);

  const res = await fetch(`${API_BASE}/api/services?${params.toString()}`);
  if (!res.ok) throw new Error("No se pudo cargar el catálogo");
  return res.json();
}

export async function getServiceById(id) {
  if (!USE_BACKEND) {
    const service = findLocalServiceByIdOrDomain(id);
    return service || makeFallbackService(id);
  }

  const res = await fetch(`${API_BASE}/api/services/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar la ficha");
  return res.json();
}
