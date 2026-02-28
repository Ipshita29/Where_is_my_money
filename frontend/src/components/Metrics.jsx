export default function Metrics({ totalSpent = 0, totalCredited = 0, anomalyCount = 0 }) {
  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const netWorth = totalCredited - totalSpent;

  const cards = [
    {
      label: "Net Balance",
      value: fmt(netWorth),
      subtext: "Total Position",
      trend: "+12.5%",
      isPositive: netWorth >= 0,
      icon: "account_balance",
      color: netWorth >= 0 ? "text-primary" : "text-expense"
    },
    {
      label: "Total Income",
      value: fmt(totalCredited),
      subtext: "Credits Detected",
      trend: "+8.2%",
      isPositive: true,
      icon: "trending_up",
      color: "text-primary"
    },
    {
      label: "Total Expenses",
      value: fmt(totalSpent),
      subtext: "Debits Detected",
      trend: "-2.4%",
      isPositive: false,
      icon: "payments",
      color: "text-expense"
    },
    {
      label: "AI Anomalies",
      value: anomalyCount,
      subtext: "Insights Found",
      trend: anomalyCount > 0 ? "Action Required" : "Secure",
      isPositive: anomalyCount === 0,
      icon: "crisis_alert",
      color: anomalyCount > 0 ? "text-alimony" : "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="glass border border-white/5 p-6 rounded-2xl flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.label}</span>
            <div className={`size-10 rounded-xl glass border border-white/5 flex items-center justify-center shrink-0 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
              <span className="material-symbols-outlined text-xl">{card.icon}</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-white tabular-nums tracking-tighter mb-1">{card.value}</p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${card.isPositive ? 'bg-primary/10 text-primary' : 'bg-expense/10 text-expense'}`}>
                {card.trend}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">{card.subtext}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}