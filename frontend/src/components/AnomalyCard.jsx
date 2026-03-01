import { useState } from "react";
import { api } from "../services/api";

export default function AnomalyCard({ id, merchant, amount, category, date, risk, details, onRefresh }) {
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingDismiss, setLoadingDismiss] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const handleExplain = async () => {
    if (explanation) {
      setExplanation(null);
      return;
    }
    setLoadingExplain(true);
    try {
      const response = await api.post("/anomalies/explain", {
        merchant, amount, category, date
      });
      setExplanation(response.data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation("Could not load explanation.");
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleDismiss = async () => {
    setLoadingDismiss(true);
    try {
      await api.post(`/anomalies/${id}/dismiss`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to dismiss anomaly.", err);
      setLoadingDismiss(false);
    }
  };

  const riskLevel = typeof risk === 'number' ? (risk > 70 ? 'CRITICAL' : 'MODERATE') : risk;

  return (
    <tr className="group hover:bg-white/[0.02] transition-all">
      <td className="p-4 md:p-6 w-12 text-center">
        <div className="relative inline-flex">
          <div className={`size-3 rounded-full ${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'bg-expense animate-pulse' : 'bg-alimony'}`} />
          <div className={`absolute inset-0 size-3 rounded-full ${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'bg-expense animate-ping' : ''} opacity-40`} />
        </div>
      </td>
      <td className="p-4 md:p-6 min-w-[200px]">
        <div className="flex flex-col">
          <span className="text-xs font-black text-white uppercase tracking-tight mb-0.5">{merchant}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{category || "Uncategorized"}</span>
        </div>
      </td>
      <td className="p-4 md:p-6">
        <span className="text-xs font-black text-expense tabular-nums tracking-tighter">₹{amount.toLocaleString()}</span>
      </td>
      <td className="p-4 md:p-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[200px] block" title={details}>
          {details}
        </span>
      </td>
      <td className="p-4 md:p-6 text-right relative">
        <div className="flex justify-end gap-2 items-center">
          {explanation && (
            <div className="absolute right-0 top-full mt-2 glass-dark z-50 p-4 rounded-xl border border-alimony/20 max-w-[300px] text-left animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-sm text-alimony">psychology</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Brain Analysis</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{explanation}</p>
            </div>
          )}
          <button
            onClick={handleExplain}
            disabled={loadingExplain}
            className={`size-9 flex items-center justify-center rounded-xl transition-all ${explanation ? 'bg-alimony text-white' : 'glass border border-white/5 text-alimony hover:bg-alimony/10'}`}
          >
            <span className="material-symbols-outlined text-lg">{loadingExplain ? "sync" : "psychology"}</span>
          </button>
          <button
            onClick={handleDismiss}
            disabled={loadingDismiss}
            className="size-9 lg:w-auto lg:px-4 flex items-center justify-center rounded-xl glass border border-white/5 text-slate-500 hover:text-white hover:bg-expense/10 hover:border-expense/20 transition-all"
          >
            <span className="material-symbols-outlined text-lg lg:text-sm">{loadingDismiss ? "sync" : "close"}</span>
            <span className="hidden lg:block ml-2 text-[10px] font-black uppercase tracking-widest">Dismiss</span>
          </button>
        </div>
      </td>
    </tr>
  );
}