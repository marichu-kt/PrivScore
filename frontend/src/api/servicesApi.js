import { catalogServices } from "../data/catalogServices";

const USE_BACKEND = false;

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

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
    const service = catalogServices.find((item) => item._id === id);
    if (!service) throw new Error("Servicio no encontrado");
    return service;
  }

  const res = await fetch(`${API_BASE}/api/services/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar la ficha");
  return res.json();
}
