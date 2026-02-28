import { useState } from "react";
import { api } from "../services/api";

export default function AnomalyCard({ id, merchant, amount, category, date, risk, details, onRefresh }) {
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingDismiss, setLoadingDismiss] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const handleExplain = async () => {
    setLoadingExplain(true);
    setExplanation(null);
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
  return (
    <tr className="hover:bg-primary/5 transition-colors group">
      <td className="px-6 py-4 w-1/3">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white">{merchant}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{risk} Risk Activity</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-sm font-bold text-rose-500 w-1/6">
        ${amount}
      </td>
      <td className="px-6 py-4 w-1/3">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 max-w-full">
          <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0"></span>
          <span className="truncate" title={details}>{details || "Deviation detected"}</span>
        </span>
      </td>
      <td className="px-6 py-4 text-right w-1/6">
        <div className="flex flex-col items-end gap-2">
          {explanation && (
            <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-primary/20 p-2 rounded-lg max-w-[200px] text-left mb-2">
              {explanation}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleExplain}
              disabled={loadingExplain}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loadingExplain ? "Thinking..." : "Explain"}
            </button>
            <button
              onClick={handleDismiss}
              disabled={loadingDismiss}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-primary/20 hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
            >
              {loadingDismiss ? "..." : "Dismiss"}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}