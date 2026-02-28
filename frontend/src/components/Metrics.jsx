import "../styles/metrics.css";

export default function Metrics() {
  return (
    <div className="metrics-grid">
      <div className="glass-card metric-card">
        <div className="metric-card-header">
          <span className="material-symbols-outlined metric-icon">account_balance_wallet</span>
          <span className="badge badge-green">+2.4%</span>
        </div>
        <p className="metric-label">Total Balance</p>
        <h3 className="metric-value">$42,560.00</h3>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-card-header">
          <span className="material-symbols-outlined metric-icon">payments</span>
          <span className="badge badge-red">-12%</span>
        </div>
        <p className="metric-label">Monthly Spending</p>
        <h3 className="metric-value">$3,842.15</h3>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-card-header">
          <span className="material-symbols-outlined metric-icon">crisis_alert</span>
          <span className="badge badge-orange">Action Needed</span>
        </div>
        <p className="metric-label">AI Detected Anomalies</p>
        <h3 className="metric-value">4 Issues</h3>
      </div>
    </div>
  );
}