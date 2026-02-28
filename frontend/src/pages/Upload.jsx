import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import "../styles/dashboard.css";

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
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                <Header />

                <div style={{ padding: "2rem", maxWidth: "560px" }}>
                    <h3 style={{ marginBottom: "1.5rem" }}>Upload Bank Statement</h3>

                    <div className="glass-card" style={{ padding: "2rem" }}>
                        <form onSubmit={handleUpload}>
                            {/* Drop zone style file picker */}
                            <label
                                htmlFor="file-input"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "2.5rem",
                                    border: "2px dashed rgba(255,255,255,0.15)",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    marginBottom: "1.5rem",
                                    transition: "border-color 0.2s",
                                    color: file ? "#22c55e" : "var(--text-muted, #aaa)",
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "2.5rem" }}>
                                    upload_file
                                </span>
                                <span style={{ fontSize: "0.9rem", textAlign: "center" }}>
                                    {file
                                        ? file.name
                                        : "Click to choose a CSV or PDF file"}
                                </span>
                                <input
                                    id="file-input"
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,.pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => setFile(e.target.files[0] || null)}
                                />
                            </label>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !file}
                                style={{ width: "100%" }}
                            >
                                {loading ? "Uploading…" : "Upload Statement"}
                            </button>
                        </form>

                        {status && (
                            <p
                                style={{
                                    marginTop: "1.25rem",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    fontSize: "0.875rem",
                                    background:
                                        status.type === "success"
                                            ? "rgba(34,197,94,0.1)"
                                            : "rgba(239,68,68,0.1)",
                                    color: status.type === "success" ? "#22c55e" : "#ef4444",
                                    border: `1px solid ${status.type === "success"
                                            ? "rgba(34,197,94,0.3)"
                                            : "rgba(239,68,68,0.3)"
                                        }`,
                                }}
                            >
                                {status.message}
                            </p>
                        )}
                    </div>

                    <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted, #aaa)" }}>
                        Supported formats: CSV (with Date, Description, Amount columns) or PDF bank statements.
                        After upload you'll be redirected to the Dashboard automatically.
                    </p>
                </div>
            </main>
        </div>
    );
}
