import AnomalyCard from "./AnomalyCard";

export default function AnomaliesSection({ anomalies = [] }) {
  return (
    <section style={{ marginTop: "32px" }}>
      <div className="anomalies-header">
        <h4>Critical Anomalies</h4>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #aaa)" }}>
          {anomalies.length} detected
        </span>
      </div>

      {anomalies.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted, #aaa)" }}
        >
          ✅ No anomalies detected. Your finances look clean!
        </div>
      ) : (
        <div className="anomalies-grid">
          {anomalies.map((anomaly) => (
            <AnomalyCard
              key={anomaly.id}
              merchant={anomaly.merchant}
              amount={anomaly.amount}
              color={anomaly.color}
              risk={anomaly.risk}
              details={anomaly.details}
            />
          ))}
        </div>
      )}
    </section>
  );
}