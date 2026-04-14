
import { Link, NavLink } from "react-router-dom";
import appLogo from "../assets/logo_PrivSocre.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbarInner">
        <Link to="/" className="brand">
          <img className="brandLogo" src={appLogo} alt="PrivScore logo" />
          <div className="brandText">
            <div className="brandName">PrivScore</div>
            <div className="brandTagline">Catálogo visual de privacidad</div>
          </div>
        </Link>

        <nav className="navLinks" aria-label="Principal">
          <NavLink to="/" className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}>
            Catálogo
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
