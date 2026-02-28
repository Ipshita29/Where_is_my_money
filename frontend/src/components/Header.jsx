import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useState } from "react";

export default function Header({ onRefresh, activeFile, dateRange, onDateRangeChange }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [clearing, setClearing] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleClearData() {
    if (!window.confirm("Are you sure you want to clear all your transaction data? This cannot be undone.")) return;

    setClearing(true);
    try {
      await api.delete("/transactions");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to clear data:", err);
      alert("Failed to clear data.");
    } finally {
      setClearing(false);
    }
  }

  // Handle date formatting for the display button
  const formatDateDisplay = () => {
    if (!dateRange || (!dateRange.start && !dateRange.end)) return "All Time";
    const start = dateRange.start ? new Date(dateRange.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '*';
    const end = dateRange.end ? new Date(dateRange.end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '*';
    return `${start} - ${end}`;
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-primary/20 flex items-center justify-between px-8 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10 w-full">
      <div className="flex items-center gap-6 w-full max-w-2xl">
        <form
          className="relative w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Search functionality coming soon!");
          }}
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-primary/5 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none text-slate-900 dark:text-white" placeholder="Search transactions, evidence..." type="text" />
        </form>

        <div className="flex items-center gap-2">
          {activeFile && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 text-xs font-medium text-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span className="truncate max-w-[150px]">Analyzing: {activeFile}</span>
            </div>
          )}

          <div className="relative group">
            <button
              className="flex items-center gap-2 bg-slate-100 dark:bg-primary/5 px-4 py-2 rounded-lg border-none whitespace-nowrap cursor-pointer hover:bg-slate-200 dark:hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-300">calendar_today</span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{formatDateDisplay()}</span>
            </button>
            <div className="absolute top-full mt-2 left-0 bg-white dark:bg-[#1A1C23] border border-slate-200 dark:border-primary/20 rounded-xl shadow-xl p-4 hidden group-hover:block z-50 min-w-[300px]">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 rounded bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-primary"
                    value={dateRange?.start || ""}
                    onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 rounded bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-primary"
                    value={dateRange?.end || ""}
                    onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, end: e.target.value })}
                  />
                </div>
                <button
                  className="text-xs text-primary hover:underline self-end"
                  onClick={() => onDateRangeChange && onDateRangeChange({ start: "", end: "" })}
                >
                  Clear Range
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {onRefresh && (
          <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-primary/5 hover:bg-slate-200 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-300 transition-colors" onClick={onRefresh}>
            <span className="material-symbols-outlined">refresh</span>
          </button>
        )}
        {token ? (
          <>
            <button className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-primary/5 hover:bg-slate-200 dark:hover:bg-primary/10 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors" onClick={handleClearData} disabled={clearing}>
              <span className="material-symbols-outlined text-sm">delete_sweep</span> {clearing ? "Clearing..." : "Clear Data"}
            </button>
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all" onClick={() => navigate("/upload")}>
              <span className="material-symbols-outlined text-sm">add</span> Upload Statement
            </button>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ml-2" onClick={handleLogout}>
              <span className="material-symbols-outlined text-sm">logout</span> Log Out
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-all" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}