
const ratingMeta = {
  A: { label: "Muy buena", tone: "good" },
  B: { label: "Buena", tone: "good" },
  C: { label: "Intermedia", tone: "neutral" },
  D: { label: "Justa", tone: "warn" },
  E: { label: "Muy invasiva", tone: "alert" },
};

export function getServiceLogo(serviceOrDomain) {
  const domain = typeof serviceOrDomain === "string"
    ? serviceOrDomain
    : serviceOrDomain?.domain;

  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function getRatingMeta(rating) {
  return ratingMeta[rating] || { label: "Sin clasificar", tone: "neutral" };
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function averageScore(items = []) {
  if (!items.length) return 0;
  return Math.round(items.reduce((acc, item) => acc + (item.score || 0), 0) / items.length);
}

export function getStatusTone(status) {
  switch (status) {
    case "ok":
      return "good";
    case "warn":
      return "warn";
    case "alert":
      return "alert";
    default:
      return "neutral";
  }
}
