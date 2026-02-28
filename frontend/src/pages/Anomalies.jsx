import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AnomalyCard from "../components/AnomalyCard";
import { api } from "../services/api";

export default function Anomalies() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnomalies();
    }, [navigate]);

    const fetchAnomalies = async () => {
        setLoading(true);
        try {
            const response = await api.get("/anomalies");
            setAnomalies(response.data);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                setError("Failed to fetch anomalies");
            }
        } finally {
            setLoading(false);
        }
    };

    const highRiskCount = anomalies.filter(a => a.risk === 'High').length;

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} currentPath="/anomalies" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} onRefresh={fetchAnomalies} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">

                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-orange-500 text-4xl">warning</span>
                                    Anomaly Detection
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Review potentially irregular transactions and track hidden financial behavior affecting child support calculations.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                <span className="material-symbols-outlined">gavel</span>
                                <span className="font-bold">{highRiskCount} Critical Issues</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : anomalies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-light/5 p-12 text-center text-slate-500 dark:text-slate-400 mt-8">
                                <span className="material-symbols-outlined mb-4 text-4xl text-primary opacity-50">health_and_safety</span>
                                <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">All Clear</p>
                                <p className="mt-2 max-w-sm">No suspicious transactions or duplicate charges detected in your current records.</p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-light/5 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-primary/20 bg-slate-50/50 dark:bg-primary/5 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                <th className="p-4 md:p-6 w-12"></th>
                                                <th className="p-4 md:p-6 min-w-[200px]">Issue Details</th>
                                                <th className="p-4 md:p-6">Amount</th>
                                                <th className="p-4 md:p-6">Risk Level</th>
                                                <th className="p-4 md:p-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-primary/10">
                                            {anomalies.map((anomaly) => (
                                                <AnomalyCard
                                                    key={anomaly.id}
                                                    {...anomaly}
                                                    onRefresh={fetchAnomalies}
                                                />
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
