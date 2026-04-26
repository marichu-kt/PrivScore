import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceById } from "../api/servicesApi";
import ServiceDetailView from "../components/serviceDetailView";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setItem(null);
    setError("");

    getServiceById(id)
      .then((service) => {
        if (cancelled) return;

        setItem(service);

        if (service?._id && service._id !== id) {
          navigate(`/services/${service._id}`, { replace: true });
        }
      })
      .catch((reason) => {
        if (cancelled) return;
        console.error(reason);
        setError("No se pudo cargar la ficha del servicio.");
      });

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (error) {
    return <div className="loadingState">{error}</div>;
  }

  if (!item) {
    return <div className="loadingState">Cargando ficha…</div>;
  }

  return <ServiceDetailView item={item} />;
}
