import appLogo from "../assets/logo_PrivSocre.png";

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerBrand">
        <img src={appLogo} alt="PrivScore" className="footerLogo" />
        <div>
          <strong>PrivScore</strong>
          <span>Lectura clara de privacidad para servicios digitales.</span>
        </div>
      </div>

      <div className="footerLinks" aria-label="Áreas de análisis">
        <span>Cookies</span>
        <span>Terceros</span>
        <span>Retención</span>
        <span>Derechos</span>
      </div>

      <div className="footerFine">© {new Date().getFullYear()} PrivScore. Evaluación visual de privacidad.</div>
    </footer>
  );
}
