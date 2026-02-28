import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Transactions({ dateRange, onDateRangeChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [navigate, dateRange]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {};
            if (dateRange?.start) params.startDate = dateRange.start;
            if (dateRange?.end) params.endDate = dateRange.end;

            const response = await api.get("/transactions", { params });
            setData(response.data);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                setError("Failed to fetch transactions");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background-dark font-display text-slate-100">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden lg:ml-64 ml-20 transition-all duration-300">
                <Header
                    onRefresh={fetchTransactions}
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                />

                <main className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
                    <div className="mx-auto max-w-7x flex flex-col gap-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Financial Records</h1>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">High-Density Transaction Ledger</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="glass border border-white/5 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                                    Export Ledger (PDF)
                                </button>
                                <button className="bg-primary text-background-dark py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                                    Finalize for Court
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense text-xs font-bold uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
                                    <span className="material-symbols-outlined text-primary animate-spin">sync</span>
                                </div>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center glass border border-white/5 rounded-3xl p-16 text-center animate-in zoom-in duration-300">
                                <div className="size-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-5xl text-slate-700">receipt_long</span>
                                </div>
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Vault is currently empty</p>
                                <Link to="/upload" className="mt-6 text-primary hover:text-white font-black text-xs uppercase tracking-widest transition-colors">
                                    Upload First Statement →
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* Filter Bar */}
                                <div className="glass border border-white/5 p-4 rounded-2xl flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="material-symbols-outlined text-sm">filter_alt</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Deep Filters:</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <select className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest outline-none focus:border-primary/50 transition-all">
                                            <option>All Categories</option>
                                            <option>Alimony</option>
                                            <option>Legal Fees</option>
                                            <option>Expenses</option>
                                        </select>
                                        <select className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest outline-none focus:border-primary/50 transition-all">
                                            <option>Evidence Status</option>
                                            <option>Verified</option>
                                            <option>Missing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="glass border border-white/5 rounded-3xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <th className="px-6 py-5">Record Date</th>
                                                    <th className="px-6 py-5">Merchant Details</th>
                                                    <th className="px-6 py-5">Category</th>
                                                    <th className="px-6 py-5">Evidence</th>
                                                    <th className="px-6 py-5 text-right">Amount (USD)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {data.map((txn) => (
                                                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-6 py-5 whitespace-nowrap text-[10px] font-bold text-slate-400 tabular-nums uppercase">
                                                            {new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="text-xs font-black text-white uppercase tracking-tight">{txn.merchant}</div>
                                                            {txn.description && (
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate max-w-[200px]">{txn.description}</div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${txn.category === 'Alimony' ? 'bg-alimony/10 text-alimony' :
                                                                txn.category === 'Legal Fees' ? 'bg-amber-500/10 text-amber-500' :
                                                                    'bg-white/5 text-slate-400'
                                                                }`}>
                                                                {txn.category || 'General'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-1">
                                                                <span className={`material-symbols-outlined text-sm ${txn.id % 3 === 0 ? 'text-primary' : txn.id % 3 === 1 ? 'text-amber-500' : 'text-slate-600'}`}>
                                                                    {txn.id % 3 === 0 ? 'verified' : txn.id % 3 === 1 ? 'pending_actions' : 'receipt'}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                                    {txn.id % 3 === 0 ? 'VERIFIED' : txn.id % 3 === 1 ? 'PENDING' : 'MISSING'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-5 text-right text-xs font-black tabular-nums tracking-tighter ${txn.type === 'credit' ? 'text-primary' : 'text-slate-200'
                                                            }`}>
                                                            {txn.type === 'credit' ? '+' : '-'}${Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
