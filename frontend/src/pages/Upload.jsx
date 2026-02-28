import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileRef = useRef();
    const navigate = useNavigate();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    async function handleUpload(e) {
        if (e) e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("statement", file);

        setLoading(true);
        setStatus(null);

        try {
            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setPreviewData(res.data.transactions || []);
            setStatus({
                type: "success",
                message: `SUCCESS: ${res.data.imported} RECORDS IMPORTED FOR ANALYSIS.`,
            });

            setFile(null);
        } catch (err) {
            setStatus({
                type: "error",
                message: err.response?.data?.error || "Import failed. System protocols compromised.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-background-dark font-display text-slate-100">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-64 ml-20 transition-all duration-300">
                <Header />

                <div className="p-8 max-w-4xl w-full mx-auto space-y-8 animate-in fade-in duration-700">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Vault Import</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload bank statements for AI-driven classification</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Instructions Header */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Protocol Guidelines</h3>
                                    <ul className="text-[10px] text-slate-400 font-bold uppercase tracking-widest space-y-3 leading-relaxed">
                                        <li className="flex gap-2">
                                            <span className="text-primary">01</span>
                                            <span>PDF & CSV Statements Supported</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">02</span>
                                            <span>Multiple Pages Parsed Automatically</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">03</span>
                                            <span>AI Classification of Legal Outliers</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="glass border border-white/5 rounded-2xl p-6 flex items-center gap-4 group hover:bg-white/5 transition-colors cursor-pointer">
                                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">help</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Need Assistance?</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">View Parsing Samples</span>
                                </div>
                            </div>
                        </div>

                        {/* Upload Zone */}
                        <div className="lg:col-span-7 space-y-6">
                            <form
                                onDragEnter={handleDrag}
                                onSubmit={handleUpload}
                                className="relative"
                            >
                                <label
                                    htmlFor="file-input"
                                    className={`relative border-2 border-dashed ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 glass'} rounded-3xl p-12 flex flex-col items-center justify-center gap-6 hover:border-primary/50 transition-all cursor-pointer group min-h-[300px] overflow-hidden`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {/* Animated Background Pulse if Loading */}
                                    {loading && (
                                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                    )}

                                    <div className={`size-20 rounded-3xl ${file ? 'bg-primary/20 text-primary shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-500 group-hover:text-primary'} flex items-center justify-center transition-all duration-500`}>
                                        <span className={`material-symbols-outlined text-4xl ${loading ? 'animate-bounce' : ''}`}>
                                            {file ? 'check_circle' : 'cloud_upload'}
                                        </span>
                                    </div>

                                    <div className="text-center z-10">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">
                                            {file ? file.name : "Drop Bank Statement"}
                                        </h4>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                            {file ? "Ready for Neural Extraction" : "Maximum payload: 20MB per file"}
                                        </p>
                                    </div>

                                    <input
                                        id="file-input"
                                        ref={fileRef}
                                        type="file"
                                        accept=".csv,.pdf"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0] || null)}
                                    />

                                    {file && !loading && (
                                        <button
                                            type="submit"
                                            className="mt-4 px-10 py-3 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all animate-in fade-in slide-in-from-bottom duration-300"
                                        >
                                            Initiate Extraction
                                        </button>
                                    )}
                                </label>
                            </form>

                            {/* Progress or Status */}
                            {loading && (
                                <div className="glass border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg animate-spin">sync</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest">{file?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Gemini-Neural parsing in progress...</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase">Parsing</span>
                                    </div>
                                    <div className="relative w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="absolute inset-0 bg-primary h-full rounded-full animate-progress shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                    </div>
                                </div>
                            )}

                            {status && (
                                <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border animate-in zoom-in duration-300 ${status.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-expense/10 border-expense/20 text-expense'}`}>
                                    {status.message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Table */}
                    {previewData.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Extraction Preview</h3>
                                <button onClick={() => navigate("/")} className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Go to Dashboard →</button>
                            </div>
                            <div className="glass border border-white/5 rounded-3xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Credit/Debit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {previewData.slice(0, 5).map((txn, i) => (
                                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 tabular-nums">{txn.date}</td>
                                                <td className="px-6 py-4 text-xs font-black text-white uppercase tracking-tight">{txn.merchant}</td>
                                                <td className={`px-6 py-4 text-right text-xs font-black tabular-nums tracking-tighter ${txn.type === 'credit' ? 'text-primary' : 'text-slate-100'}`}>
                                                    {txn.type === 'credit' ? '+' : '-'}${Math.abs(txn.amount).toLocaleString()}
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
    );
}
