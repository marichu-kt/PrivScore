import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById } from "../api/servicesApi";
import ServiceDetailView from "../components/serviceDetailView";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getServiceById(id)
      .then((service) => {
        if (cancelled) return;
        setItem(service);
      })
      .catch((reason) => {
        if (cancelled) return;
        console.error(reason);
        setError("No se pudo cargar la ficha del servicio.");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return <div className="loadingState">{error}</div>;
  }

  if (!item) {
    return <div className="loadingState">Cargando ficha…</div>;
  }

  return <ServiceDetailView item={item} />;
}
