import { Link } from "react-router-dom";
import { formatDate, getRatingMeta } from "../lib/serviceUtils";
import NutriScore from "./nutriScore";
import LogoMark from "./logoMark";

function ServiceIcon({ name }) {
  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 4v4" />
        <path d="M16 4v4" />
        <path d="M4 9h16" />
        <rect x="4" y="5" width="16" height="16" rx="3" />
      </>
    ),
    category: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 20v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
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
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M4 16V6a2 2 0 0 1 2-2h10" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    preferences: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
        <path d="m18 14 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L15 16.3l2-.3Z" />
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
    thumbs: (
      <>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        <path d="M7 11 11 3a3 3 0 0 1 3 3v4h5a3 3 0 0 1 2.9 3.7l-1.4 5A4 4 0 0 1 16.7 22H7Z" />
      </>
    ),
    timer: (
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v5l3 2" />
        <path d="M9 2h6" />
        <path d="m16 5 2-2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
  };

  return (
    <svg className={`serviceIcon serviceIcon--${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function MetricPill({ label, value, icon }) {
  return (
    <div className="metricPill">
      <ServiceIcon name={icon} />
      <span className="metricPillText">
        <span>{label}</span>
        <strong>{value}</strong>
      </span>
    </div>
  );
}

export default function ServiceCard({ service }) {
  const rating = getRatingMeta(service.rating);

  return (
    <article className="serviceCard" data-rating={service.rating}>
      <div className="serviceCardTop">
        <div className="serviceIdentity">
          <LogoMark item={service} className="serviceLogo" fallbackClassName="serviceLogoFallback" />
          <div className="titleWrap">
            <div className="eyebrowRow">
              <span className="categoryChip">
                <ServiceIcon name="category" />
                {service.category}
              </span>
              <span className="microMeta">
                <ServiceIcon name="calendar" />
                Revisión {formatDate(service.updatedAt)}
              </span>
            </div>
            <h3 className="title">{service.name}</h3>
            <div className="meta">
              <ServiceIcon name="globe" />
              {service.domain}
            </div>
          </div>
        </div>

        <div className="ratingStack">
          <NutriScore rating={service.rating} size="compact" score={service.score} />
          <span className={`toneChip ${rating.tone}`}>
            <ServiceIcon name="shield" />
            {rating.label}
          </span>
        </div>
      </div>

      <p className="summary">{service.summary}</p>

      <div className="metricPills">
        <MetricPill label="Cookies" value={service.cookieSummary?.total ?? 0} icon="cookie" />
        <MetricPill label="Trackers" value={service.trackerCount ?? 0} icon="target" />
        <MetricPill label="Terceros" value={service.thirdPartyCount ?? 0} icon="users" />
        <MetricPill label="Retención" value={service.retentionShort || service.retention || "Variable"} icon="timer" />
      </div>

      <div className="highlightList">
        {service.privacyHighlights?.slice(0, 3).map((item, index) => (
          <span key={item} className="softChip">
            <ServiceIcon name={["shield", "copy", "preferences"][index] || "shield"} />
            {item}
          </span>
        ))}
      </div>

      <div className="cardFooter">
        <div className="miniText">
          <span className="favorIcon">
            <ServiceIcon name="thumbs" />
          </span>
          <span>
            <strong>A favor:</strong> {service.strength}
          </span>
        </div>
        <Link className="primaryButton" to={`/services/${service._id}`}>
          <span>Ver ficha completa</span>
          <ServiceIcon name="arrow" />
        </Link>
      </div>
    </article>
  );
}
