import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/charts.css";

export default function SpendingChart({ monthlySpending = {} }) {
  // Convert object { "2025-01": 1200 } → sorted array for Recharts
  const data = Object.entries(monthlySpending)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, amount]) => ({
      month: month.slice(0, 7), // "YYYY-MM"
      amount: Math.round(amount * 100) / 100,
    }));

  const isEmpty = data.length === 0;

  return (
    <div className="glass-card">
      <div className="chart-header">
        <h4>Spending Overview</h4>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted, #aaa)" }}>
          Monthly
        </span>
      </div>

      <div className="chart-container">
        {isEmpty ? (
          <p style={{ color: "var(--text-muted, #aaa)", padding: "2rem 0", textAlign: "center" }}>
            No transaction data yet. Upload a statement to see your spending trend.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#aaa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#aaa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(30,30,40,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [`$${value}`, "Spent"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4, fill: "#22c55e" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}