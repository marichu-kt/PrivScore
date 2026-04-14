import { Link } from "react-router-dom";
import { formatDateTime, getRatingMeta, getStatusTone } from "../lib/serviceUtils";
import NutriScore from "./nutriScore";
import LogoMark from "./logoMark";

function MetricCard({ label, value, helper }) {
  return (
    <div className="metricCard">
      <div className="metricLabel">{label}</div>
      <div className="metricValue">{value}</div>
      <div className="metricHelper">{helper}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`sectionCard ${className}`.trim()}>
      <div className="sectionCardHead">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function ServiceDetailView({ item, backTo = "/", backLabel = "Volver al catálogo" }) {
  const ratingMeta = getRatingMeta(item.rating);
  const browserSignals = item.browserSignals || null;

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
                <span className="categoryChip">{item.category}</span>
                <span className="microMeta">{item.reviewStatus}</span>
              </div>
              <h1>{item.name}</h1>
              <div className="meta">{item.domain} · {item.location}</div>
            </div>
          </div>

          <p className="lead">{item.tagline}</p>
          <p className="summary detailSummary">{item.summary}</p>

          <div className="heroChips">
            {item.privacyHighlights?.map((itemText) => (
              <span key={itemText} className="softChip">{itemText}</span>
            ))}
          </div>
        </div>

        <aside className="scorePanel">
          <NutriScore rating={item.rating} size="large" score={item.score} />
          <div className="scoreMeta">
            <span className={`toneChip ${ratingMeta.tone}`}>{ratingMeta.label}</span>
            <span className="softChip strong">{item.reviewStatus}</span>
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

      <div className="twoCols">
        <SectionCard title="Desglose del score" subtitle="Lectura por bloques para entender la nota final.">
          <div className="scoreBreakdown">
            {item.scoreBreakdown?.map((block) => (
              <div className="scoreRow" key={block.label}>
                <div className="scoreRowTop">
                  <strong>{block.label}</strong>
                  <span>{block.value}/100</span>
                </div>
                <div className="progressTrack">
                  <div className="progressFill" style={{ width: `${block.value}%` }} />
                </div>
                <p>{block.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Checklist visual" subtitle="Elementos que normalmente condicionan la experiencia de privacidad.">
          <div className="checkGrid">
            {item.checklist?.map((entry) => (
              <article key={entry.label} className={`checkItem ${getStatusTone(entry.status)}`}>
                <div className="checkLabel">{entry.label}</div>
                <p>{entry.note}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Hallazgos clave" subtitle="Aspectos que influyen en la exposición de datos del servicio.">
        <div className="findingsGrid">
          {item.findings?.map((finding) => (
            <article key={`${finding.title}-${finding.body}`} className={`findingCard ${finding.tone}`}>
              <h3>{finding.title}</h3>
              <p>{finding.body}</p>
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

      <div className="twoCols alignStart">
        <SectionCard title="Términos y condiciones" subtitle="Puntos contractuales que conviene revisar junto a la política de privacidad.">
          <div className="termsList">
            {item.termsHighlights?.map((entry) => (
              <article key={entry} className="termsItem">
                <span className="termsDot" />
                <p>{entry}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Enlaces legales" subtitle="Accesos directos a la documentación principal del servicio.">
          <div className="linkList">
            <a href={item.policyLinks?.privacy} target="_blank" rel="noreferrer">Política de privacidad</a>
            <a href={item.policyLinks?.terms} target="_blank" rel="noreferrer">Términos y condiciones</a>
            <a href={item.policyLinks?.cookies} target="_blank" rel="noreferrer">Política de cookies</a>
          </div>
          <div className="noteBox">
            Revisa estos documentos junto con el banner de consentimiento, la configuración de cuenta
            y el comportamiento real del servicio en el navegador.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
