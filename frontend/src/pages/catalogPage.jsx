import { useEffect, useMemo, useState } from "react";
import { getServices } from "../api/servicesApi";
import ServiceCard from "../components/serviceCard";
import appLogo from "../assets/logo_PrivSocre.png";
import { averageScore } from "../lib/serviceUtils";
import NutriScore from "../components/nutriScore";

function HeroIcon({ name }) {
  const icons = {
    bars: (
      <>
        <path d="M6 16v-3" />
        <path d="M11 16V8" />
        <path d="M16 16V5" />
        <path d="M4 20h16" />
      </>
    ),
    cookie: (
      <>
        <path d="M20 13.4A8 8 0 1 1 10.6 4a4 4 0 0 0 5.4 5.4 4 4 0 0 0 4 4Z" />
        <path d="M8 10h.01" />
        <path d="M12 15h.01" />
        <path d="M8.5 17.5h.01" />
      </>
    ),
    document: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),
    gauge: (
      <>
        <path d="M4 14a8 8 0 0 1 16 0" />
        <path d="M6.5 17a7 7 0 0 1-1.5-3" />
        <path d="M19 14a7 7 0 0 1-1.5 3" />
        <path d="m12 14 4-5" />
        <path d="M8 14h.01" />
        <path d="M12 6v2" />
        <path d="M16 14h.01" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
    rights: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
      </>
    ),
  };

  return (
    <svg className={`heroIconSvg heroIconSvg--${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function StatCard({ label, value, helper }) {
  const iconByLabel = {
    Cookies: "cookie",
    "Score medio": "gauge",
    "Servicios visibles": "grid",
    "Trackers / terceros": "target",
  };

  return (
    <div className="statCard" data-stat={iconByLabel[label]}>
      <div className="statIcon">
        <HeroIcon name={iconByLabel[label] || "grid"} />
      </div>
      <div className="statBody">
        <div className="statLabel">{label}</div>
        <div className="statValue">{value}</div>
        <div className="statDivider" aria-hidden="true" />
        <div className="statHelper">{helper}</div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [allItems, setAllItems] = useState([]);
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("score-desc");
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    getServices()
      .then(setAllItems)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setShowAllServices(false);
  }, [q, rating, category, sortBy]);

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
  const visibleServiceCards = showAllServices ? visibleItems : visibleItems.slice(0, 10);
  const canShowAllServices = visibleItems.length > 10 && !showAllServices;
  const canShowLessServices = visibleItems.length > 10 && showAllServices;

  return (
    <div className="catalogPage">
      <section className="heroPanel">
        <div className="heroContent">
          <div className="heroBadge">
            <img src={appLogo} alt="PrivScore" className="heroIcon" />
            <span>PrivScore</span>
          </div>

          <div className="heroHeadlineRow">
            <span className="heroShieldBadge">
              <HeroIcon name="shield" />
            </span>
            <h1>Consulta la privacidad de cada servicio de un vistazo</h1>
          </div>

          <p>
            Cada ficha reúne score, cookies, terceros, conservación de datos, derechos y enlaces legales
            en una lectura clara y ordenada.
          </p>

          <div className="heroChips">
            <span className="heroChip">
              <span className="heroChipIcon heroChipIcon--blue">
                <HeroIcon name="cookie" />
              </span>
              Cookies y tecnologías similares
            </span>
            <span className="heroChip">
              <span className="heroChipIcon heroChipIcon--blue">
                <HeroIcon name="document" />
              </span>
              Términos y condiciones
            </span>
            <span className="heroChip">
              <span className="heroChipIcon heroChipIcon--purple">
                <HeroIcon name="rights" />
              </span>
              Derechos y conservación
            </span>
          </div>
        </div>

        <div className="heroAside heroAsideScale">
          <div className="heroAsideHead">
            <span className="heroAsideIcon">
              <HeroIcon name="bars" />
            </span>
            <div className="asideTitle">Escala de lectura</div>
          </div>

          <p>De A a E, donde A indica menor exposición de datos y mejores controles visibles.</p>

          <NutriScore size="hero" />

          <div className="heroLegend">
            <span className="heroLegendItem good">A-B más contenida</span>
            <span className="heroLegendItem mid">C equilibrio medio</span>
            <span className="heroLegendItem high">D-E exposición alta</span>
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
        <>
          <div className="catalogGrid">
            {visibleServiceCards.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
          {canShowAllServices ? (
            <div className="catalogActions">
              <button className="loadMoreButton" type="button" onClick={() => setShowAllServices(true)}>
                Ver todos
              </button>
            </div>
          ) : null}
          {canShowLessServices ? (
            <div className="catalogActions">
              <button className="loadMoreButton loadMoreButtonSecondary" type="button" onClick={() => setShowAllServices(false)}>
                Ver menos
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="emptyState">
          <h3>No hay resultados con ese filtro</h3>
          <p>Prueba otra categoría, rating o una búsqueda más amplia.</p>
        </div>
      )}

    </div>
  );
}
