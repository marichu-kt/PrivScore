import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ServiceDetailView from "../components/serviceDetailView";
import { loadPersistedAnalysisReport, persistAnalysisReport, readReportFromSearch } from "../lib/analysisPayload";
import { buildServiceFromReport, findCatalogMatch } from "../lib/reportToService";
import { catalogServices } from "../data/catalogServices";

export default function AnalysisDetailPage() {
  const location = useLocation();
  const [report, setReport] = useState(() => {
    const fromUrl = readReportFromSearch(location.search);
    return fromUrl || loadPersistedAnalysisReport();
  });

  useEffect(() => {
    const fromUrl = readReportFromSearch(location.search);
    if (fromUrl) {
      persistAnalysisReport(fromUrl);
      setReport(fromUrl);
      return;
    }

    const saved = loadPersistedAnalysisReport();
    if (saved) setReport(saved);
  }, [location.search]);

  const matchedService = useMemo(() => {
    if (!report) return null;
    return findCatalogMatch(catalogServices, report.host || report.url);
  }, [report]);

  const item = useMemo(() => {
    if (!report) return null;
    return buildServiceFromReport(report, matchedService);
  }, [matchedService, report]);

  if (!item) {
    return (
      <div className="emptyState">
        <h3>No hay un análisis abierto todavía</h3>
        <p>Analiza una web desde la extensión y pulsa “Ver detalle” para abrir su ficha dinámica en este frontend.</p>
      </div>
    );
  }

  return <ServiceDetailView item={item} backLabel="Ver más webs" />;
}
