import "../styles/charts.css";

export default function SpendingChart() {
  return (
    <div className="glass-card">
      <div className="chart-header">
        <h4>Spending Overview</h4>
        <select className="chart-select">
          <option>Last 30 Days</option>
          <option>Last 6 Months</option>
        </select>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none">
          <path
            d="M0,250 Q100,220 200,240 T400,150 T600,180 T800,100 T1000,120 V300 H0 Z"
            fill="rgba(34,197,94,0.1)"
          />
          <path
            d="M0,250 Q100,220 200,240 T400,150 T600,180 T800,100 T1000,120"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
          />
        </svg>

        <div className="chart-labels">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
}