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
    <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 w-full backdrop-blur-xl">
      <div className="flex items-center gap-6 w-full max-w-2xl">
        <form
          className="relative w-full max-w-md group"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Search functionality coming soon!");
          }}
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none text-white placeholder:text-slate-500 transition-all focus:bg-white/10"
            placeholder="Search records, evidence..."
            type="text"
          />
        </form>

        <div className="flex items-center gap-2">
          {activeFile && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="truncate max-w-[150px]">{activeFile}</span>
            </div>
          )}

          <div className="relative group/date">
            <button
              className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-all hover:border-white/10"
            >
              <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{formatDateDisplay()}</span>
            </button>
            <div className="absolute top-full mt-2 left-0 glass-dark border border-white/10 rounded-2xl shadow-2xl p-5 hidden group-hover/date:block z-50 min-w-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Filter Range</h3>
                  <button
                    className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors"
                    onClick={() => onDateRangeChange && onDateRangeChange({ start: "", end: "" })}
                  >
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Start</label>
                    <input
                      type="date"
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs outline-none focus:border-primary text-white transition-all"
                      value={dateRange?.start || ""}
                      onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">End</label>
                    <input
                      type="date"
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs outline-none focus:border-primary text-white transition-all"
                      value={dateRange?.end || ""}
                      onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group" onClick={onRefresh} title="Refresh Data">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">refresh</span>
          </button>
        )}
        {token ? (
          <>
            <button className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest transition-all" onClick={handleClearData} disabled={clearing}>
              <span className="material-symbols-outlined text-sm text-expense">delete_sweep</span> {clearing ? "..." : "Clear"}
            </button>
            <button className="bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-background-dark px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all" onClick={() => navigate("/upload")}>
              <span className="material-symbols-outlined text-sm">add</span> Statement
            </button>
            <button className="bg-expense/10 hover:bg-expense/20 border border-expense/20 text-expense px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all" onClick={handleLogout}>
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg" onClick={() => navigate("/signup")}>
              Join Free
            </button>
          </div>
        )}
      </div>
    </header>
  );
}