import "../styles/charts.css";

export default function CategoryChart() {
  return (
    <div className="glass-card">
      <h4 className="category-title">Category Distribution</h4>

      <div className="category-chart-container">
        <div className="pie-chart">
          <div className="pie-segment-1"></div>
          <div className="pie-segment-2"></div>
        </div>

        <div className="category-legend">
          <div className="legend-item">
            <div className="legend-label">
              <span className="dot primary"></span> Housing
            </div>
            <span>45%</span>
          </div>

          <div className="legend-item">
            <div className="legend-label">
              <span className="dot light"></span> Food
            </div>
            <span>22%</span>
          </div>

          <div className="legend-item">
            <div className="legend-label">
              <span className="dot dark"></span> Other
            </div>
            <span>33%</span>
          </div>
        </div>
      </div>
    </div>
  );
}