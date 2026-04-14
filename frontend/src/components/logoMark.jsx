import { useMemo, useState } from "react";
import { getServiceLogo } from "../lib/serviceUtils";

function initialsFromName(name = "") {
  const words = String(name || "")
    .replace(/[^\p{L}\p{N} ]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

export default function LogoMark({ item, className = "serviceLogo", fallbackClassName = "serviceLogoFallback" }) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = item?.logoUrl || getServiceLogo(item);
  const initials = useMemo(() => initialsFromName(item?.name), [item?.name]);

  return (
    <div className={`${className} logoMark`.trim()} aria-hidden="true">
      {!hasError && logoUrl ? (
        <img
          className="logoMarkImg"
          src={logoUrl}
          alt={`${item?.name || "Servicio"} logo`}
          onError={() => setHasError(true)}
        />
      ) : null}
      <span className={`${fallbackClassName} logoMarkFallback`.trim()}>{initials}</span>
    </div>
  );
}
