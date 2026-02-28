export default function Metrics({ totalSpent = 0, totalCredited = 0, anomalyCount = 0 }) {
  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const netWorth = totalCredited - totalSpent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Net Worth */}
      <div className="bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">Net Bal.</span>
          <span className={`material-symbols-outlined ${netWorth >= 0 ? 'text-success-green' : 'text-expense-red'}`}>account_balance</span>
        </div>
        <p className="text-2xl font-bold text-white">{fmt(netWorth)}</p>
        <p className={`text-xs font-medium ${netWorth >= 0 ? 'text-success-green' : 'text-expense-red'}`}>
          {netWorth >= 0 ? 'Positive' : 'Negative'} Balance
        </p>
      </div>

      {/* Income */}
      <div className="bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">Income</span>
          <span className="material-symbols-outlined text-success-green">trending_up</span>
        </div>
        <p className="text-2xl font-bold text-white">{fmt(totalCredited)}</p>
        <p className="text-xs text-slate-400 font-medium">Total Credited</p>
      </div>

      {/* Spending */}
      <div className="bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">Spending</span>
          <span className="material-symbols-outlined text-expense-red">payments</span>
        </div>
        <p className="text-2xl font-bold text-white">{fmt(totalSpent)}</p>
        <p className="text-xs text-slate-400 font-medium">Total Spent</p>
      </div>

      {/* Anomalies */}
      <div className="bg-[#1A1C23]/60 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">Anomalies</span>
          <span className={`material-symbols-outlined ${anomalyCount > 0 ? "text-amber-500" : "text-success-green"}`}>crisis_alert</span>
        </div>
        <p className="text-2xl font-bold text-white">{anomalyCount}</p>
        <p className={`text-xs font-medium ${anomalyCount > 0 ? "text-amber-500" : "text-success-green"}`}>
          {anomalyCount > 0 ? "Action Needed" : "All Clear"}
        </p>
      </div>
    </div>
  );
}