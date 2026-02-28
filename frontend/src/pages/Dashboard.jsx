import "../styles/dashboard.css";
import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Dashboard</h1>
      </div>

      <div className="grid">
        <Card title="Total Spent" value="₹35,200" />
        <Card title="Anomalies Detected" value="12" />
        <Card title="Risk Score" value="78/100" />
      </div>

      <div className="chart-section">
        <div className="chart-card">Timeline Chart (Recharts Placeholder)</div>
        <div className="chart-card">Category Distribution (Recharts Placeholder)</div>
      </div>

      <div className="bottom-section">
        <div className="large-card">
          <h3>Recent Transactions</h3>
          <p className="placeholder">Table Coming Soon...</p>
        </div>

        <div className="large-card">
          <h3>Risk Heatmap</h3>
          <p className="placeholder">Map/Heat UI Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}