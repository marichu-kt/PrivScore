import { Link } from "react-router-dom";
import { formatDateTime, getRatingMeta, getStatusTone } from "../lib/serviceUtils";
import NutriScore from "./nutriScore";
import LogoMark from "./logoMark";

function DetailIcon({ name }) {
  const icons = {
    bar: (
      <>
        <path d="M6 18v-5" />
        <path d="M12 18V7" />
        <path d="M18 18v-9" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 4v4" />
        <path d="M16 4v4" />
        <path d="M4 9h16" />
        <rect x="4" y="5" width="16" height="16" rx="3" />
        <path d="M8 13h.01" />
        <path d="M12 13h.01" />
        <path d="M16 13h.01" />
        <path d="M8 17h.01" />
        <path d="M12 17h.01" />
        <path d="M16 17h.01" />
      </>
    ),
    controls: (
      <>
        <path d="M4 7h10" />
        <path d="M18 7h2" />
        <circle cx="16" cy="7" r="2" />
        <path d="M4 17h2" />
        <path d="M10 17h10" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l4 2" />
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
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    fileCheck: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="m8 15 2 2 5-6" />
        <path d="M8 11h3" />
      </>
    ),
    fileText: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    list: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M8 9h8" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        <path d="M12 15v2" />
      </>
    ),
    muted: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m16 9 5 5" />
        <path d="m21 9-5 5" />
      </>
    ),
    outbound: (
      <>
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    retention: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v6h6" />
        <path d="M12 7v5l3 2" />
        <rect x="14" y="14" width="7" height="6" rx="1.5" />
        <path d="M16 14v-1a2 2 0 0 1 4 0v1" />
      </>
    ),
    scorebars: (
      <>
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
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
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    userTrash: (
      <>
        <circle cx="10" cy="8" r="4" />
        <path d="M3.5 21a6.5 6.5 0 0 1 9.5-5.8" />
        <path d="M15 16h6" />
        <path d="M17 16v-2h2v2" />
        <path d="m20 16-.5 5h-3l-.5-5" />
      </>
    ),
    userCheck: (
      <>
        <circle cx="10" cy="8" r="4" />
        <path d="M3.5 21a6.5 6.5 0 0 1 10.2-5.4" />
        <circle cx="17" cy="17" r="4" />
        <path d="m15.4 17 1.1 1.1 2.2-2.5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    warn: (
      <>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
  };

  return (
    <svg className={`detailIcon detailIcon--${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function MetricCard({ label, value, helper }) {
  const iconByLabel = {
    Borrado: "trash",
    Cookies: "cookie",
    Retención: "retention",
    Terceros: "users",
    Trackers: "target",
    "Última revisión": "calendar",
  };
  const icon = iconByLabel[label] || "bar";

  return (
    <div className="metricCard" data-metric={icon}>
      <div className="metricIcon">
        <DetailIcon name={icon} />
      </div>
      <div className="metricLabel">{label}</div>
      <div className="metricValue">{value}</div>
      <div className="metricDivider" aria-hidden="true" />
      <div className="metricHelper">{helper}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, className = "", icon = null }) {
  return (
    <section className={`sectionCard ${className}`.trim()}>
      <div className="sectionCardHead">
        {icon ? <span className="sectionCardIcon">{icon}</span> : null}
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function ServiceDetailView({ item, backTo = "/", backLabel = "Volver al catálogo" }) {
  const ratingMeta = getRatingMeta(item.rating);
  const browserSignals = item.browserSignals || null;
  const catalogStatus = item.rank ? `Catálogo · top ${item.rank}` : item.reviewStatus;
  const highlights = item.privacyHighlights?.slice(0, 3) || [];
  const findingIcons = ["fileCheck", "bar", "clock"];
  const termsIcons = ["shield", "userCheck", "muted"];
  const legalLinks = [
    { label: "Política de privacidad", href: item.policyLinks?.privacy, icon: "lock" },
    { label: "Términos y condiciones", href: item.policyLinks?.terms, icon: "fileText" },
    { label: "Política de cookies", href: item.policyLinks?.cookies, icon: "cookie" },
  ];

  return (
    <div className="detailPage">
      <Link className="backLink" to={backTo}>
        ← {backLabel}
      </Link>

      <section className="detailHero">
        <div className="detailHeroMain">
          <div className="detailIdentity">
<LogoMark item={item} className="detailLogo" fallbackClassName="detailLogoFallback" />
            <div>
              <div className="eyebrowRow">
                <span className="categoryChip">
                  <DetailIcon name="users" />
                  {item.category}
                </span>
                <span className="microMeta">
                  <DetailIcon name="bar" />
                  {catalogStatus}
                </span>
              </div>
              <h1>{item.name}</h1>
              <div className="meta detailDomainMeta">
                <span>{item.domain}</span>
                <span>·</span>
                <span>{item.location}</span>
              </div>
            </div>
          </div>

          <p className="lead">{item.tagline}</p>
          <p className="summary detailSummary">{item.summary}</p>

          <div className="heroChips">
            {highlights.map((itemText, index) => (
              <span key={itemText} className="softChip">
                <DetailIcon name={["eye", "shield", "user"][index] || "shield"} />
                {itemText}
              </span>
            ))}
          </div>
        </div>

        <aside className="scorePanel">
          <NutriScore rating={item.rating} size="large" score={item.score} />
          <div className="scoreMeta">
            <span className={`toneChip ${ratingMeta.tone}`}>{ratingMeta.label}</span>
            <span className="softChip strong">{catalogStatus}</span>
          </div>
          <div className="scorePanelText">
            <strong>A favor:</strong> {item.strength}
          </div>
          <div className="scorePanelText">
            <strong>Ojo con:</strong> {item.caution}
          </div>
          {browserSignals ? (
            <div className="analysisBanner">
              <strong>Lectura abierta desde extensión.</strong>
              <span>{browserSignals.confidence}% de confianza · {browserSignals.mode === "ai" ? "Extracción asistida por IA" : "Scoring por reglas"}</span>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="metricsGrid">
        <MetricCard label="Cookies" value={item.cookieSummary?.total ?? 0} helper="Inventario principal detectado o documentado" />
        <MetricCard label="Trackers" value={item.trackerCount ?? 0} helper="Herramientas de medición, soporte o ads" />
        <MetricCard label="Terceros" value={item.thirdPartyCount ?? 0} helper="Servicios integrados o partners declarados" />
        <MetricCard label="Retención" value={item.retentionShort || item.retention} helper="Resumen corto de conservación" />
        <MetricCard label="Borrado" value={item.deletion} helper="Cómo se gestiona el cierre de cuenta" />
        <MetricCard label="Última revisión" value={formatDateTime(item.updatedAt)} helper="Fecha visible de ficha" />
      </section>

      <div className="twoCols termsLegalGrid">
        <SectionCard
          title="Términos y condiciones"
          className="termsLegalCard"
          icon={<DetailIcon name="fileCheck" />}
        >
          <div className="termsList">
            {item.termsHighlights?.map((entry, index) => (
              <article key={entry} className="termsItem">
                <span className="termsItemIcon">
                  <DetailIcon name={termsIcons[index] || "fileCheck"} />
                </span>
                <p>{entry}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Enlaces legales"
          className="legalLinksCard"
          icon={<DetailIcon name="shield" />}
        >
          <div className="linkList">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                <span className="legalLinkIcon">
                  <DetailIcon name={link.icon} />
                </span>
                <span>{link.label}</span>
                <DetailIcon name="outbound" />
              </a>
            ))}
          </div>
          <div className="noteBox">
            <span className="legalNoteIcon">
              <DetailIcon name="info" />
            </span>
            <span>
              Revisa estos documentos junto con el banner de consentimiento, la configuración de cuenta
              y el comportamiento real del servicio en el navegador.
            </span>
          </div>
        </SectionCard>
      </div>

      <div className="twoCols">
        <SectionCard
          title="Desglose del score"
          subtitle="Lectura por bloques para entender la nota final."
          className="scoreBreakdownCard"
          icon={<DetailIcon name="scorebars" />}
        >
          <div className="scoreBreakdown">
            {item.scoreBreakdown?.map((block, index) => (
              <article className="scoreRow" key={block.label}>
                <span className="scoreRowIndex">{String(index + 1).padStart(2, "0")}</span>
                <div className="scoreRowBody">
                  <div className="scoreRowTop">
                    <strong>{block.label}</strong>
                    <span>{block.value}/100</span>
                  </div>
                  <p>{block.note}</p>
                  <div className="progressTrack">
                    <div className="progressFill" style={{ width: `${block.value}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Checklist visual"
          subtitle="Elementos que normalmente condicionan la experiencia de privacidad."
          className="checklistVisualCard"
          icon={<DetailIcon name="shield" />}
        >
          <div className="checkGrid">
            {item.checklist?.map((entry, index) => (
              <article key={entry.label} className={`checkItem ${getStatusTone(entry.status)}`}>
                <span className="checkItemIcon">
                  <DetailIcon name={["list", "controls", "download", "userTrash"][index] || "shield"} />
                </span>
                <div>
                  <div className="checkLabel">{entry.label}</div>
                  <p>{entry.note}</p>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Hallazgos clave"
        className="findingsSectionCard"
      >
        <div className="findingsGrid">
          {item.findings?.map((finding, index) => (
            <article key={`${finding.title}-${finding.body}`} className={`findingCard ${finding.tone}`}>
              <span className="findingIcon">
                <DetailIcon name={findingIcons[index] || "shield"} />
              </span>
              <div className="findingContent">
                <h3>{finding.title}</h3>
                <span className="findingAccent" aria-hidden="true" />
                <p>{finding.body}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="twoCols alignStart">
        <SectionCard title="Cookies" subtitle="Familias principales y ejemplos frecuentes del servicio.">
          <div className="cookieCategoryList">
            {item.cookieCategories?.map((entry) => (
              <div className="cookieCategoryRow" key={entry.label}>
                <div className="cookieCategoryTop">
                  <span>{entry.label}</span>
                  <strong>{entry.value}%</strong>
                </div>
                <div className="progressTrack">
                  <div className={`progressFill ${entry.tone || "neutral"}`} style={{ width: `${entry.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="dataTable">
            <div className="tableHead">
              <span>Cookie</span>
              <span>Proveedor</span>
              <span>Duración</span>
              <span>Categoría</span>
            </div>
            {item.cookies?.map((cookie) => (
              <div className="tableRow" key={`${cookie.name}-${cookie.provider}`}>
                <div>
                  <strong>{cookie.name}</strong>
                  <p>{cookie.purpose}</p>
                </div>
                <span>{cookie.provider}</span>
                <span>{cookie.duration}</span>
                <span>{cookie.category}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Terceros y socios" subtitle="Herramientas integradas y proveedores asociados al tratamiento.">
          <div className="partnerList">
            {item.trackers?.map((tracker) => (
              <article key={`${tracker.name}-${tracker.company}`} className="partnerItem">
                <div>
                  <strong>{tracker.name}</strong>
                  <p>{tracker.company}</p>
                </div>
                <div className="partnerMeta">
                  <span className="softChip">{tracker.category}</span>
                  <span>{tracker.purpose}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="chipCluster">
            {item.sharedWith?.map((partner) => (
              <span key={partner} className="softChip">{partner}</span>
            ))}
          </div>
        </SectionCard>
      </div>

      {browserSignals ? (
        <div className="twoCols alignStart">
          <SectionCard title="Análisis técnico en navegador" subtitle="Señales reales que la extensión ha visto al cargar esta web.">
            <div className="stackBlock">
              <div>
                <h3 className="subTitle">Resumen técnico</h3>
                <div className="chipCluster">
                  {browserSignals.externalSummary?.map((entry) => (
                    <span key={entry} className="softChip strong">{entry}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="subTitle">Storage detectado</h3>
                <div className="chipCluster">
                  {browserSignals.storageSummary?.map((entry) => (
                    <span key={entry} className="softChip">{entry}</span>
                  ))}
                </div>
                {browserSignals.storageKeys?.length ? (
                  <ul className="detailList compactList">
                    {browserSignals.storageKeys.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Consentimiento y trazas" subtitle="Lectura del banner o CMP y dominios que más peso han tenido en la carga.">
            <div className="stackBlock">
              <div className="noteBox">{browserSignals.consentSummary}</div>
              <div className="partnerList compactPartners">
                {browserSignals.externalDomains?.map((entry) => (
                  <article key={`${entry.domain}-${entry.count}`} className="partnerItem">
                    <div>
                      <strong>{entry.domain}</strong>
                      <p>{entry.count} recursos observados</p>
                    </div>
                    <div className="partnerMeta">
                      <span className="softChip">{entry.category || "Tercero"}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      ) : null}

      <div className="twoCols alignStart">
        <SectionCard title="Datos y derechos" subtitle="Tipos de datos declarados y controles disponibles para el usuario.">
          <div className="stackBlock">
            <div>
              <h3 className="subTitle">Datos que declara recopilar</h3>
              <div className="chipCluster">
                {item.collectedData?.map((entry) => (
                  <span key={entry} className="softChip">{entry}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="subTitle">Derechos y controles</h3>
              <div className="chipCluster">
                {item.rights?.map((entry) => (
                  <span key={entry} className="softChip strong">{entry}</span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Retención y transferencias" subtitle="Conservación declarada y ubicaciones mencionadas en la documentación.">
          <div className="stackBlock">
            <ul className="detailList">
              {item.retentionDetails?.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>

            <div>
              <h3 className="subTitle">Transferencias o ubicaciones</h3>
              <div className="chipCluster">
                {item.transfers?.map((entry) => (
                  <span key={entry} className="softChip">{entry}</span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
