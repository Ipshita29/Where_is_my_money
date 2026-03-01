import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/", icon: "dashboard" },
  { label: "Transactions", to: "/transactions", icon: "receipt_long" },
  { label: "Anomalies", to: "/anomalies", icon: "analytics" },
  { label: "Upload", to: "/upload", icon: "folder_shared" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sticky top-0 h-screen shrink-0 flex flex-col glass border-r border-white/5 z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-20 lg:w-64'}`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start lg:px-6'} pt-8 pb-4 mb-2 overflow-hidden`}>
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="size-10 shrink-0 bg-primary rounded-xl flex items-center justify-center text-background-dark shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer hover:scale-105 transition-transform"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined font-bold">
            {isCollapsed ? "menu" : "menu_open"}
          </span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-2 overflow-hidden">
        {navItems.map(({ label, icon, to }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setIsCollapsed(true)}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`material-symbols-outlined shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{icon}</span>
              {!isCollapsed && (
                <span className="font-bold text-sm tracking-tight hidden lg:block whitespace-nowrap animate-in fade-in duration-300">{label}</span>
              )}

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-background-dark rounded-r-full shadow-[2px_0_10px_rgba(0,0,0,0.5)] lg:hidden" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}