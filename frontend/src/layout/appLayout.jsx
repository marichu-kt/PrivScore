import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

export default function AppLayout() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}