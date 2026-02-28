import AnomalyCard from "./AnomalyCard";

export default function AnomaliesSection({ anomalies = [] }) {
  return (
    <section className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">warning</span>
          Critical Anomalies
        </h3>
        <span className="text-sm font-medium text-slate-400">
          {anomalies.length} detected
        </span>
      </div>

      {anomalies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <span className="material-symbols-outlined text-4xl text-success-green mb-2">check_circle</span>
          <p>No anomalies detected. Your finances look clean!</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-xs font-bold uppercase tracking-wider text-primary/60">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Deviation Reason</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
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
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}