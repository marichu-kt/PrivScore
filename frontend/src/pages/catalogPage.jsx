
import { useEffect, useMemo, useState } from "react";
import { getServices } from "../api/servicesApi";
import ServiceCard from "../components/serviceCard";
import appLogo from "../assets/logo_PrivSocre.png";
import { averageScore } from "../lib/serviceUtils";
import NutriScore from "../components/nutriScore";

function StatCard({ label, value, helper }) {
  return (
    <div className="statCard">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      <div className="statHelper">{helper}</div>
    </div>
  );
}

export default function CatalogPage() {
  const [allItems, setAllItems] = useState([]);
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("score-desc");

  useEffect(() => {
    getServices()
      .then(setAllItems)
      .catch(console.error);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(allItems.map((item) => item.category))).sort((a, b) => a.localeCompare(b)),
    [allItems]
  );

  const visibleItems = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const filtered = allItems.filter((service) => {
      const matchesText =
        !qq ||
        service.name.toLowerCase().includes(qq) ||
        service.domain.toLowerCase().includes(qq) ||
        service.category.toLowerCase().includes(qq);

      const matchesRating = !rating || service.rating === rating;
      const matchesCategory = !category || service.category === category;

      return matchesText && matchesRating && matchesCategory;
    });

    switch (sortBy) {
      case "score-asc":
        return filtered.sort((a, b) => (a.score || 0) - (b.score || 0));
      case "az":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case "rating":
        return filtered.sort((a, b) => a.rating.localeCompare(b.rating));
      default:
        return filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
  }, [allItems, q, rating, category, sortBy]);

  const totalCookies = visibleItems.reduce((acc, item) => acc + (item.cookieSummary?.total || 0), 0);
  const totalTrackers = visibleItems.reduce((acc, item) => acc + (item.trackerCount || 0), 0);
  const totalThirdParties = visibleItems.reduce((acc, item) => acc + (item.thirdPartyCount || 0), 0);
  const avgScore = averageScore(visibleItems);

  return (
    <div className="catalogPage">
      <section className="heroPanel">
        <div className="heroContent">
          <div className="heroBadge">
            <img src={appLogo} alt="PrivScore" className="heroIcon" />
            <span>PrivScore</span>
          </div>
          <h1>Consulta la privacidad de cada servicio de un vistazo</h1>
          <p>
            Cada ficha reúne score, cookies, terceros, conservación de datos, derechos y enlaces legales
            en una lectura clara y ordenada.
          </p>
          <div className="heroChips">
            <span className="softChip strong">Cookies y tecnologías similares</span>
            <span className="softChip strong">Términos y condiciones</span>
            <span className="softChip strong">Derechos y conservación</span>
          </div>
        </div>

        <div className="heroAside heroAsideScale">
          <div>
            <div className="asideTitle">Escala de lectura</div>
            <p>
              De A a E, donde A indica menor exposición de datos y mejores controles visibles.
            </p>
          </div>
          <NutriScore size="hero" />
          <div className="heroLegend">
            <span>A–B más contenida</span>
            <span>C equilibrio medio</span>
            <span>D–E exposición alta</span>
          </div>
        </div>
      </section>

      <section className="statsGrid">
        <StatCard label="Servicios visibles" value={visibleItems.length} helper="Catálogo filtrado en tiempo real" />
        <StatCard label="Score medio" value={`${avgScore}/100`} helper="Promedio del conjunto actual" />
        <StatCard label="Cookies" value={totalCookies} helper="Suma de cookies documentadas" />
        <StatCard label="Trackers / terceros" value={`${totalTrackers} / ${totalThirdParties}`} helper="Huella técnica agregada" />
      </section>

      <section className="controlPanel">
        <div className="field">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre, dominio o categoría"
          />
        </div>

        <div className="field">
          <label htmlFor="rating">Rating</label>
          <select id="rating" className="select" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Todos</option>
            {["A", "B", "C", "D", "E"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="category">Categoría</label>
          <select id="category" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sort">Ordenar</label>
          <select id="sort" className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="score-desc">Score alto primero</option>
            <option value="score-asc">Score bajo primero</option>
            <option value="rating">Por rating</option>
            <option value="az">Nombre A-Z</option>
            <option value="za">Nombre Z-A</option>
          </select>
        </div>
      </section>

      <div className="sectionHeader">
        <div>
          <h2>Servicios</h2>
          <p>Filtra por dominio, categoría o nivel de exposición.</p>
        </div>
        <div className="sectionCount">{visibleItems.length} resultados</div>
      </div>

      {visibleItems.length ? (
        <div className="catalogGrid">
          {visibleItems.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <h3>No hay resultados con ese filtro</h3>
          <p>Prueba otra categoría, rating o una búsqueda más amplia.</p>
        </div>
      )}
    </div>
  );
}
