import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Metrics from "../components/Metrics";
import SpendingChart from "../components/SpendingChart";
import CategoryChart from "../components/CategoryChart";
import AnomaliesSection from "../components/AnomaliesSection";

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

      const [summaryRes, anomaliesRes] = await Promise.all([
        api.get("/transactions/summary", { params }),
        api.get("/anomalies", { params }),
      ]);
      setSummary(summaryRes.data);
      setAnomalies(anomaliesRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <div className="flex h-full min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
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
          <div className="p-8 space-y-8 overflow-y-auto w-full max-w-7xl mx-auto">
            <Metrics
              totalSpent={summary?.totalSpent ?? 0}
              totalCredited={summary?.totalCredited ?? 0}
              anomalyCount={anomalies.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col">
                <SpendingChart monthlySpending={summary?.monthlySpending ?? {}} />
              </div>
              <div className="lg:col-span-5 bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col">
                <CategoryChart categoryTotals={summary?.categoryTotals ?? {}} />
              </div>
            </div>

            <div className="bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden p-6">
              <AnomaliesSection anomalies={anomalies} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}