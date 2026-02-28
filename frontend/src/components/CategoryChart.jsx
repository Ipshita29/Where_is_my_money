import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Palette that fits the existing dark-green design
const COLORS = ["#22c55e", "#4ade80", "#86efac", "#6366f1", "#f59e0b", "#ef4444", "#06b6d4"];

export default function CategoryChart({ categoryTotals = {} }) {
  const entries = Object.entries(categoryTotals);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  const data = entries
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }));

  const isEmpty = data.length === 0;

  return (
    <div className="flex flex-col h-full w-full">
      <h4 className="text-lg font-bold text-white mb-6">Category Distribution</h4>

      <div className="flex-1 w-full min-h-[220px]">
        {isEmpty ? (
          <p className="text-slate-400 text-center py-8">
            No categories yet. Upload a statement to see distribution.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(30,30,40,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value, name, props) => [
                  `$${value} (${props.payload.pct}%)`,
                  name,
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={9}
                formatter={(name) => (
                  <span className="text-slate-300 text-xs ml-1">{name}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}