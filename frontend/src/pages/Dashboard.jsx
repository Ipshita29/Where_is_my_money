import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Metrics from "../components/Metrics";
import SpendingChart from "../components/SpendingChart";
import CategoryChart from "../components/CategoryChart";
import AnomaliesSection from "../components/AnomaliesSection";

import { api } from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, anomaliesRes] = await Promise.all([
        api.get("/transactions/summary"),
        api.get("/anomalies"),
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
  }, []);

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header onRefresh={fetchData} />

        {error && (
          <p style={{ color: "var(--red, #ef4444)", padding: "1rem" }}>
            {error}
          </p>
        )}

        {loading ? (
          <div style={{ padding: "2rem", color: "var(--text-muted, #aaa)" }}>
            Loading your data…
          </div>
        ) : (
          <div className="dashboard-grid">
            <Metrics
              totalSpent={summary?.totalSpent ?? 0}
              totalCredited={summary?.totalCredited ?? 0}
              anomalyCount={anomalies.length}
            />

            <div className="content-grid">
              <SpendingChart monthlySpending={summary?.monthlySpending ?? {}} />
              <CategoryChart categoryTotals={summary?.categoryTotals ?? {}} />
            </div>

            <AnomaliesSection anomalies={anomalies} />
          </div>
        )}
      </main>
    </div>
  );
}