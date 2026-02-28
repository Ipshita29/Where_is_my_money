import "../styles/anomalies.css";

export default function AnomalyCard({ merchant, amount, risk, color, details }) {
  return (
    <div className="glass-card anomaly-card">
      <div className={`anomaly-accent accent-${color}`}></div>

      <div className="anomaly-header">
        <div className="merchant-info">
          <div className="merchant-logo">{merchant.slice(0, 3).toUpperCase()}</div>
          <div>
            <h5>{merchant}</h5>
            <p className="muted">Suspicious Activity</p>
          </div>
        </div>

        <div className="right-info">
          <p className="amount">${amount}</p>
          <span className={`risk-tag ${color}`}>{risk} Risk</span>
        </div>
      </div>

      <div className={`ai-analysis-box box-${color}`}>
        <p>{details}</p>
      </div>

      <div className="card-footer">
        <div>
          <span className="footer-label">Risk Score</span>
          <p className={`score-${color}`}>89/100</p>
        </div>
        <button className="footer-btn">Review</button>
      </div>
    </div>
  );
}