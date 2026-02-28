import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/", icon: "dashboard" },
  { label: "Transactions", to: "/transactions", icon: "receipt_long" },
  { label: "Anomalies", to: "/anomalies", icon: "analytics" },
  { label: "Upload", to: "/upload", icon: "folder_shared" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  return (
    <aside className="w-20 lg:w-64 fixed left-0 top-0 h-screen flex flex-col glass border-r border-white/5 z-40 transition-all duration-300">
      <div className="flex items-center gap-3 p-6 mb-4">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-background-dark shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <span className="material-symbols-outlined font-bold">account_balance_wallet</span>
        </div>
        <h2 className="text-xl font-black tracking-tighter text-white hidden lg:block uppercase">Alimony</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(({ label, icon, to }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{icon}</span>
              <span className="font-bold text-sm tracking-tight hidden lg:block">{label}</span>

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(16,185,129,0.8)] lg:hidden" />
              )}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 mt-auto">
          <div className="rounded-2xl p-3 flex items-center gap-3 glass border-white/5 text-white overflow-hidden group hover:bg-white/5 transition-colors cursor-pointer">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-background-dark text-xl font-bold">person</span>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-black truncate uppercase tracking-widest text-primary">{user.name || "User"}</p>
              <p className="text-[10px] text-slate-500 truncate font-bold">PREMIUM ACCOUNT</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}