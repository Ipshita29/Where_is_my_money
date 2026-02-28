import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Metrics from "../components/Metrics";
import CashflowSankey from "../components/CashflowSankey";
import DailySpendingBar from "../components/DailySpendingBar";
import AnomaliesSection from "../components/AnomaliesSection";
import RecentTransactionsTable from "../components/RecentTransactionsTable";

import { api } from "../services/api";

export default function Dashboard({ dateRange, onDateRangeChange }) {
  const [summary, setSummary] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (dateRange?.start) params.startDate = dateRange.start;
      if (dateRange?.end) params.endDate = dateRange.end;

      const [summaryRes, anomaliesRes, transactionsRes] = await Promise.all([
        api.get("/transactions/summary", { params }),
        api.get("/anomalies", { params }),
        api.get("/transactions", { params }),
      ]);
      setSummary(summaryRes.data);
      setAnomalies(anomaliesRes.data);
      setRecentTransactions(transactionsRes.data.slice(0, 5));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <div className="flex h-full min-h-screen bg-background-dark font-display text-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 lg:ml-64 ml-20 transition-all duration-300">
        <Header
          onRefresh={fetchData}
          activeFile={summary?.activeFile}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />

        {error && (
          <p className="text-red-500 p-4 font-semibold">{error}</p>
        )}

        {loading ? (
          <div className="p-8 text-slate-500 font-medium">
            Loading your data...
          </div>
        ) : (
          <div className="p-8 space-y-8 overflow-y-auto w-full max-w-7xl mx-auto animate-in fade-in duration-700">
            <Metrics
              totalSpent={summary?.totalSpent ?? 0}
              totalCredited={summary?.totalCredited ?? 0}
              anomalyCount={anomalies.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 glass border border-white/5 rounded-2xl p-6 flex flex-col min-h-[400px]">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Cashflow Analysis (Sankey)</h3>
                <CashflowSankey data={summary} />
              </div>
              <div className="lg:col-span-4 glass border border-white/5 rounded-2xl p-6 flex flex-col min-h-[400px]">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Recent Activity</h3>
                <RecentTransactionsTable transactions={recentTransactions} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col min-h-[350px]">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Daily Spending (31-Day Trend)</h3>
                <DailySpendingBar data={summary?.monthlySpending} />
              </div>
            </div>

            <div className="glass border border-white/5 rounded-2xl overflow-hidden p-6 animate-pulse-subtle">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Anomaly Detection</h3>
                <span className="px-2 py-1 bg-expense/10 text-expense text-[10px] font-black rounded uppercase tracking-tighter">AI Pulse Active</span>
              </div>
              <AnomaliesSection anomalies={anomalies} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}