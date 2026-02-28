import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">analytics</span>
          Spending Overview
        </h4>
        <span className="text-xs font-normal text-slate-400">
          Monthly
        </span>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        {isEmpty ? (
          <p className="text-slate-400 text-center py-8">
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