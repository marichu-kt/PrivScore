import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import SiteFooter from "../components/siteFooter";

export default function AppLayout() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="main">
        <Outlet />
        <SiteFooter />
      </main>
    </div>
  );
}
