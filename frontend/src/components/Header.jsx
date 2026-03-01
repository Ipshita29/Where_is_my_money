import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function Header({ onRefresh, activeFile, dateRange, onDateRangeChange, onSearch }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const [clearing, setClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function handleClearData() {
    setShowClearConfirm(true);
  }

  async function confirmClearData() {
    setClearing(true);
    try {
      await api.delete("/transactions");
      if (onRefresh) onRefresh();
      setShowClearConfirm(false);
    } catch (err) {
      console.error("Failed to clear data:", err);
      alert("Failed to clear data.");
    } finally {
      setClearing(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value); // Live search
    }
  };

  // Handle date formatting for the display button
  const formatDateDisplay = () => {
    if (!dateRange || (!dateRange.start && !dateRange.end)) return "All Time";
    const start = dateRange.start ? new Date(dateRange.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '*';
    const end = dateRange.end ? new Date(dateRange.end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '*';
    return `${start} - ${end}`;
  };

  return (
    <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 w-full backdrop-blur-xl">
      <div className="flex items-center gap-6 w-full max-w-3xl">
        <h2 className="text-xl font-black tracking-tighter text-white uppercase whitespace-nowrap hidden md:block">
          Where is my <span className="text-primary">Money</span>?
        </h2>

        {onSearch && (
          <form
            className="relative w-full max-w-md group"
            onSubmit={handleSearchSubmit}
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none text-white placeholder:text-slate-500 transition-all focus:bg-white/10"
              placeholder="Search records, evidence..."
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        )}

        <div className="flex items-center gap-2">
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
        {token ? (
          <>
            <button className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest transition-all" onClick={handleClearData} disabled={clearing}>
              <span className="material-symbols-outlined text-sm text-expense">delete_sweep</span> {clearing ? "..." : "Clear"}
            </button>
            <button className="bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-background-dark px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all" onClick={() => navigate("/upload")}>
              <span className="material-symbols-outlined text-sm">add</span> Statement
            </button>
            <button className="bg-expense/10 hover:bg-expense/20 border border-expense/20 text-expense px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all" title="Logout" onClick={handleLogout}>
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
            <div className="size-11 ml-2 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shrink-0 shadow-lg border border-primary/20 cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all" title={user?.name || "User Account"}>
              <span className="material-symbols-outlined text-background-dark text-xl font-bold">person</span>
            </div>

            {/* Clear Confirmation Modal Overlay via Portal */}
            {showClearConfirm && createPortal(
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="glass border border-expense/20 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col gap-6 animate-in zoom-in-95 duration-300">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-16 rounded-full bg-expense/10 flex items-center justify-center text-expense">
                      <span className="material-symbols-outlined text-3xl">warning</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Clear All Data?</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        This action will permanently delete all your financial records and evidence. This cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                      disabled={clearing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmClearData}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-expense hover:bg-expense/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex justify-center items-center gap-2"
                      disabled={clearing}
                    >
                      {clearing ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : "Delete All"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}

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