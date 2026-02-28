import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Transactions", to: "/transactions" },
  { label: "Anomalies", to: "/anomalies" },
  { label: "Upload", to: "/upload" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo-text">Where Is My Money?</h1>
        <p className="logo-subtext">Personal Finance AI</p>
      </div>

      <nav className="nav-links">
        {navItems.map(({ label, icon, to }) => (
          <Link
            key={to}
            to={to}
            className={`nav-item${pathname === to ? " active" : ""}`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}