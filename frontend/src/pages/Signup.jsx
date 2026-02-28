import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("tracking"); // 'tracking' or 'evidence'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });
      const loginRes = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Protocol initialization error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-background-dark font-display text-white overflow-hidden">
      {/* Left Side: Marketing Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] size-[600px] rounded-full bg-white/5 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] size-[500px] rounded-full bg-black/30 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-lg w-full flex flex-col gap-12 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-white text-3xl">account_balance</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Alimony Finance</h2>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-black leading-tight tracking-tighter">
              Document Everything.<br />
              <span className="text-white/60">Fear Nothing.</span>
            </h1>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-widest text-white">Bank-Grade Security</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">256-bit AES encryption for all legal sensitive data.</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">monitoring</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-widest text-white">Anomaly Detection</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Real-time scans for inconsistent spending patterns.</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">gavel</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-widest text-white">Trial Ready</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Automated PDF reports formatted for legal counsel.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 opacity-60">
            <div className="flex flex-col">
              <span className="text-2xl font-black">15k+</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Active Users</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-black">99.9%</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center p-8 lg:p-24 bg-background-dark animate-in fade-in duration-1000">
        <div className="max-w-md w-full mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <div className="h-1 flex-1 bg-white/5 rounded-full" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocol Phase 01</h3>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Establish Terminal</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Create your secure financial dossier</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSignup}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Name</label>
              <div className="relative group">
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-2xl glass border border-white/5 text-white text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="Johnathan Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">badge</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Communication Uplink (Email)</label>
              <div className="relative group">
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-2xl glass border border-white/5 text-white text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="name@secure.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Passcode</label>
              <div className="relative group">
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-2xl glass border border-white/5 text-white text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">fingerprint</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Objective</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGoal('tracking')}
                  className={`p-4 rounded-2xl glass border flex flex-col gap-2 transition-all group ${goal === 'tracking' ? 'border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/10'}`}
                >
                  <span className={`material-symbols-outlined text-xl ${goal === 'tracking' ? 'text-primary' : 'text-slate-400'}`}>query_stats</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Standard Tracking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('evidence')}
                  className={`p-4 rounded-2xl glass border flex flex-col gap-2 transition-all group ${goal === 'evidence' ? 'border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/10'}`}
                >
                  <span className={`material-symbols-outlined text-xl ${goal === 'evidence' ? 'text-primary' : 'text-slate-400'}`}>balance</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Evidence Prep</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="h-12 bg-primary text-background-dark font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 mt-6"
              disabled={loading}
            >
              {loading ? "Initializing..." : "Finalize Establishment"}
            </button>

            <p className="text-center text-[8px] font-bold text-slate-600 uppercase tracking-[0.1em] px-10 leading-relaxed">
              By initializing, you agree to the <span className="text-slate-400">Tactical Terms of Service</span> & <span className="text-slate-400">Privacy Protocols</span>.
            </p>
          </form>

          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Already established? <a className="text-primary font-black hover:text-white transition-colors" href="/login">Initialize Uplink</a>
          </p>
        </div>
      </div>
    </div>
  );
}