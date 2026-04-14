
import { Link } from "react-router-dom";
import { formatDate, getRatingMeta } from "../lib/serviceUtils";
import NutriScore from "./nutriScore";
import LogoMark from "./logoMark";

function MetricPill({ label, value }) {
  return (
    <div className="metricPill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function ServiceCard({ service }) {
  const rating = getRatingMeta(service.rating);

  return (
    <article className="serviceCard">
      <div className="serviceCardTop">
        <div className="leftRow">
<LogoMark item={service} className="serviceLogo" fallbackClassName="serviceLogoFallback" />
          <div className="titleWrap">
            <div className="eyebrowRow">
              <span className="categoryChip">{service.category}</span>
              <span className="microMeta">Revisión {formatDate(service.updatedAt)}</span>
            </div>
            <h3 className="title">{service.name}</h3>
            <div className="meta">{service.domain}</div>
          </div>
        </div>

        <div className="ratingStack">
          <NutriScore rating={service.rating} size="compact" score={service.score} />
          <span className={`toneChip ${rating.tone}`}>{rating.label}</span>
        </div>
      </div>

      <p className="summary">{service.summary}</p>

      <div className="metricPills">
        <MetricPill label="Cookies" value={service.cookieSummary?.total ?? 0} />
        <MetricPill label="Trackers" value={service.trackerCount ?? 0} />
        <MetricPill label="Terceros" value={service.thirdPartyCount ?? 0} />
        <MetricPill label="Retención" value={service.retentionShort || service.retention || "Variable"} />
      </div>

      <div className="highlightList">
        {service.privacyHighlights?.slice(0, 3).map((item) => (
          <span key={item} className="softChip">{item}</span>
        ))}
      </div>

      <div className="cardFooter">
        <div className="miniText">
          <strong>A favor:</strong> {service.strength}
        </div>
        <Link className="primaryButton" to={`/services/${service._id}`}>
          Ver ficha completa
        </Link>
      </div>
    </article>
  );
}
