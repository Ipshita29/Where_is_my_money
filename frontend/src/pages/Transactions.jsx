import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Transactions({ dateRange, onDateRangeChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("ALL");
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
            <div className="flex flex-1 flex-col overflow-hidden min-w-0 transition-all duration-300">
                <Header
                    onRefresh={fetchTransactions}
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    onSearch={setSearchQuery}
                />

                <main className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
                    <div className="mx-auto max-w-7x flex flex-col gap-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Financial Records</h1>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">High-Density Transaction Ledger</p>
                            </div>
                            <div className="hidden md:flex bg-white/5 rounded-xl p-1 border border-white/10">
                                <button onClick={() => setFilterType('ALL')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === 'ALL' ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>All</button>
                                <button onClick={() => setFilterType('CREDIT')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === 'CREDIT' ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Credited</button>
                                <button onClick={() => setFilterType('DEBIT')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === 'DEBIT' ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Debited</button>
                            </div>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <div className="md:hidden flex bg-white/5 rounded-xl p-1 border border-white/10 w-full mb-4 mt-2">
                            <button onClick={() => setFilterType('ALL')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === 'ALL' ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>All</button>
                            <button onClick={() => setFilterType('CREDIT')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === 'CREDIT' ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Credits</button>
                            <button onClick={() => setFilterType('DEBIT')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === 'DEBIT' ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Debits</button>
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
                        ) : (
                            <div className="flex flex-col gap-6">

                                <div className="glass border border-white/5 rounded-3xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <th className="px-6 py-5">Record Date</th>
                                                    <th className="px-6 py-5">Merchant Details</th>
                                                    <th className="px-6 py-5">Category</th>
                                                    <th className="px-6 py-5">Evidence</th>
                                                    <th className="px-6 py-5 text-right">Amount (INR)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {data.filter(txn => {
                                                    // Type filter
                                                    if (filterType === 'CREDIT' && txn.amount < 0) return false;
                                                    if (filterType === 'DEBIT' && txn.amount >= 0) return false;

                                                    // Search filter
                                                    if (!searchQuery) return true;
                                                    const q = searchQuery.toLowerCase();
                                                    return (
                                                        (txn.merchant && txn.merchant.toLowerCase().includes(q)) ||
                                                        (txn.description && txn.description.toLowerCase().includes(q)) ||
                                                        (txn.category && txn.category.toLowerCase().includes(q)) ||
                                                        (txn.amount && txn.amount.toString().includes(q))
                                                    );
                                                }).map((txn) => (
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
                                                        <td className={`px-6 py-5 text-right text-xs font-black tabular-nums tracking-tighter ${txn.amount >= 0 ? 'text-primary' : 'text-expense'
                                                            }`}>
                                                            {txn.amount >= 0 ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}

                                                {data.filter(txn => {
                                                    if (!searchQuery) return true;
                                                    const q = searchQuery.toLowerCase();
                                                    return (txn.merchant?.toLowerCase().includes(q) || txn.description?.toLowerCase().includes(q) || txn.category?.toLowerCase().includes(q) || txn.amount?.toString().includes(q));
                                                }).length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-xs font-black uppercase tracking-widest">
                                                                No transactions found matching "{searchQuery}"
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div >
    );
}
