import { catalogServices } from "../data/catalogServices";

const USE_BACKEND = false;

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

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
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isSameDomainOrSubdomain(hostname, serviceDomain) {
  if (!hostname || !serviceDomain) return false;
  return hostname === serviceDomain || hostname.endsWith(`.${serviceDomain}`);
}

function findLocalServiceByIdOrDomain(id) {
  const decodedId = decodeValue(id).trim();
  const normalizedLookupDomain = normalizeDomain(decodedId);
  const slugifiedLookup = slugify(decodedId);

  const exactById = catalogServices.find((item) => item._id === decodedId || item._id === slugifiedLookup);
  if (exactById) return exactById;

  const exactByDomain = catalogServices.find((item) => normalizeDomain(item.domain) === normalizedLookupDomain);
  if (exactByDomain) return exactByDomain;

  const byDomainSlug = catalogServices.find((item) => slugify(item.domain) === slugifiedLookup);
  if (byDomainSlug) return byDomainSlug;

  const servicesBySpecificDomain = [...catalogServices].sort((a, b) => {
    return normalizeDomain(b.domain).length - normalizeDomain(a.domain).length;
  });

  return servicesBySpecificDomain.find((item) => {
    return isSameDomainOrSubdomain(normalizedLookupDomain, normalizeDomain(item.domain));
  });
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
    if (!service) throw new Error("Servicio no encontrado");
    return service;
  }

  const res = await fetch(`${API_BASE}/api/services/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar la ficha");
  return res.json();
}
