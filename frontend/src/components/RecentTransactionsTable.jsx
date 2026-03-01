export default function RecentTransactionsTable({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">receipt_long</span>
                <p className="text-xs font-bold uppercase tracking-widest">No recent records</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Merchant</th>
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 text-[10px] font-bold text-slate-400 tabular-nums uppercase">
                                    {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                                </td>
                                <td className="py-3">
                                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{tx.merchant || tx.description}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{tx.category || "General"}</p>
                                </td>
                                <td className={`py-3 text-xs font-black text-right tabular-nums ${tx.amount >= 0 ? 'text-primary' : 'text-expense'}`}>
                                    {tx.amount >= 0 ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="mt-4 w-full py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-white/10 transition-all">
                View All History
            </button>
        </div>
    );
}
