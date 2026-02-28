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
    <aside className="w-64 border-r border-slate-200 dark:border-primary/20 flex flex-col p-6 hidden lg:flex bg-background-light dark:bg-background-dark h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="size-8 bg-primary rounded flex items-center justify-center text-background-dark">
          <span className="material-symbols-outlined font-bold">account_balance_wallet</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Alimony Finance</h2>
      </div>
      <nav className="space-y-2 flex-1">
        {navItems.map(({ label, icon, to }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-slate-100 dark:hover:bg-primary/5 text-slate-700 dark:text-slate-300"
                }`}
            >
              <span className="material-symbols-outlined">{icon}</span> {label}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="mt-auto rounded-xl p-4 flex items-center gap-3 bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 text-white">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{user.email || "Premium Account"}</p>
          </div>
        </div>
      )}
    </aside>
  );
}