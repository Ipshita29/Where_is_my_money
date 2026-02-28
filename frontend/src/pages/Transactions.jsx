import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Transactions({ dateRange, onDateRangeChange }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="flex h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} currentPath="/transactions" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    onRefresh={fetchTransactions}
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="text-3xl font-black mb-8">Transactions</h1>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-light/5 p-12 text-center text-slate-500 dark:text-slate-400 mt-8">
                                <span className="material-symbols-outlined mb-4 text-4xl opacity-50">receipt_long</span>
                                <p>No transactions found.</p>
                                <Link to="/upload" className="mt-4 text-primary hover:underline font-semibold">
                                    Upload a statement to get started
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-light/5 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-primary/20 bg-slate-50/50 dark:bg-primary/5 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Merchant</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-primary/10">
                                            {data.map((txn) => (
                                                <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{txn.date}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900 dark:text-slate-100">{txn.merchant}</div>
                                                        {txn.description && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">{txn.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:text-slate-300">
                                                            {txn.category || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${txn.amount < 0 ? 'text-slate-900 dark:text-slate-100' : 'text-primary'
                                                        }`}>
                                                        {txn.amount < 0 ? `-${Math.abs(txn.amount).toFixed(2)}` : `+${txn.amount.toFixed(2)}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
