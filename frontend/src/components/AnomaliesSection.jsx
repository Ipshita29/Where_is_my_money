import AnomalyCard from "./AnomalyCard";

export default function AnomaliesSection({ anomalies = [] }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* AI Recommendations Card */}
      <div className="glass border border-alimony/20 bg-alimony/5 rounded-2xl p-6 flex items-start gap-4 animate-in slide-in-from-left duration-500">
        <div className="size-12 rounded-xl bg-alimony/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <span className="material-symbols-outlined text-alimony animate-pulse">auto_awesome</span>
        </div>
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">AI Recommendation</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Multiple outliers detected in "Legal Fees". Consider reviewing these transactions for potential classification errors or unrecorded court-ready evidence.
          </p>
        </div>
      </div>

      <section className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between pb-6 mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              Anomaly Scanning Report
            </h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="size-1.5 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Live Scan</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
            {anomalies.length} Flagged
          </span>
        </div>

        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 rounded-3xl bg-primary/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-primary opacity-20">verified</span>
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Financial Integrity Verified</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 w-12"></th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[200px]">Transaction Record</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Amount</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Insight</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {anomalies.map((anomaly) => (
                  <AnomalyCard
                    key={anomaly.id}
                    id={anomaly.id}
                    merchant={anomaly.merchant}
                    amount={anomaly.amount}
                    category={anomaly.category}
                    date={anomaly.date}
                    risk={anomaly.risk_score || "HIGH"}
                    details={anomaly.explanation || anomaly.details}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}