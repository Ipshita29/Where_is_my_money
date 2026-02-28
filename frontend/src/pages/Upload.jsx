import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null); // { type: "success"|"error", message }
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();
    const navigate = useNavigate();

    async function handleUpload(e) {
        e.preventDefault();
        if (!file) {
            setStatus({ type: "error", message: "Please select a CSV or PDF file first." });
            return;
        }

        const formData = new FormData();
        formData.append("statement", file);

        setLoading(true);
        setStatus(null);

        try {
            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setStatus({
                type: "success",
                message: `✅ ${res.data.message}. Imported: ${res.data.imported} transaction(s).`,
            });

            // Reset file input
            setFile(null);
            if (fileRef.current) fileRef.current.value = "";

            // After a short delay, go back to dashboard so it re-fetches
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setStatus({
                type: "error",
                message: err.response?.data?.error || "Upload failed. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-full min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="p-8 max-w-3xl w-full mx-auto space-y-8 mt-10">
                    {/* Instructions Header */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-6 items-start">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary">
                            <span className="material-symbols-outlined text-primary">lightbulb</span>
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold mb-1">How to upload for best results</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Ensure your CSV or PDF contains clear column headers for Date, Description, and Amount.
                                Multi-page PDF statements are supported.
                                Our AI will automatically categorize transactions relevant to alimony and child support.
                            </p>
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div className="space-y-4">
                        <form onSubmit={handleUpload}>
                            <label
                                htmlFor="file-input"
                                className={`border-2 border-dashed ${file ? 'border-primary' : 'border-primary/30'} rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer group bg-background-light dark:bg-[#1A1C23]/60`}
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {file ? file.name : "Drag and drop bank statements"}
                                    </h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                                        {file ? "File selected. Click to change." : "Support for CSV and PDF files. Max file size 20MB."}
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

                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Confirm & Extract Transactions"}
                                </button>
                            </label>
                        </form>

                        {/* Progress or Status */}
                        {loading && (
                            <div className="bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl p-5 space-y-4 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary animate-spin">sync</span>
                                        <div>
                                            <p className="text-sm font-bold">{file?.name}</p>
                                            <p className="text-xs text-slate-500">Processing transactions via Gemini API...</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-full rounded-full animate-pulse shadow-[0_0_8px_rgba(16,183,72,0.5)]"></div>
                                </div>
                            </div>
                        )}

                        {status && (
                            <div className={`mt-4 p-4 rounded-xl text-sm border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                {status.message}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
