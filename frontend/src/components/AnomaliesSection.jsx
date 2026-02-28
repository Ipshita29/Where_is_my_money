import AnomalyCard from "./AnomalyCard";

export default function AnomaliesSection() {
  return (
    <section style={{ marginTop: "32px" }}>
      <div className="anomalies-header">
        <h4>Critical Anomalies</h4>
        <a href="#">View All Reports</a>
      </div>

      <div className="anomalies-grid">
        <AnomalyCard
          merchant="Amazon"
          amount="149.00"
          color="red"
          risk="High"
          details="Duplicated charge detected twice this week."
        />

        <AnomalyCard
          merchant="Starbucks"
          amount="42.50"
          color="orange"
          risk="Medium"
          details="Unusual location detected during this transaction."
        />

        <AnomalyCard
          merchant="Spotify"
          amount="16.99"
          color="green"
          risk="Low"
          details="Subscription price increased by $2."
        />
      </div>
    </section>
  );
}