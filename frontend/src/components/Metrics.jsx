import "../styles/metrics.css";

export default function Metrics({ totalSpent = 0, totalCredited = 0, anomalyCount = 0 }) {
  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="metrics-grid">
      <div className="glass-card metric-card">
        <div className="metric-card-header">
          <span className="material-symbols-outlined metric-icon">
            account_balance_wallet
          </span>
          <span className="badge badge-green">Income</span>
        </div>
        <p className="metric-label">Total Credited</p>
        <h3 className="metric-value">{fmt(totalCredited)}</h3>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-card-header">
          <span className="material-symbols-outlined metric-icon">payments</span>
          <span className="badge badge-red">Spending</span>
        </div>
        <p className="metric-label">Total Spent</p>
        <h3 className="metric-value">{fmt(totalSpent)}</h3>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-card-header">
          <span className="material-symbols-outlined metric-icon">
            crisis_alert
          </span>
          <span className={`badge ${anomalyCount > 0 ? "badge-orange" : "badge-green"}`}>
            {anomalyCount > 0 ? "Action Needed" : "All Clear"}
          </span>
        </div>
        <p className="metric-label">AI Detected Anomalies</p>
        <h3 className="metric-value">
          {anomalyCount} {anomalyCount === 1 ? "Issue" : "Issues"}
        </h3>
      </div>
    </div>
  );
}