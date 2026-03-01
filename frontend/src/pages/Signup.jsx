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
            <h2 className="text-2xl font-black uppercase tracking-tighter">Where is my Money?</h2>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-black leading-tight tracking-tighter">
              Finance Viewer.<br />
              <span className="text-white/60">Asset Tracker.</span>
            </h1>

            
            <div className="flex flex-col gap-6">
         
              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">account_balance_wallet</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Track Every Rupee
                  </span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    Auto-categorizes your spending and income instantly.
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">search_insights</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Spending Insights
                  </span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    Detect hidden money leaks and unusual expense spikes.
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">pie_chart</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Smart Breakdown
                  </span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    Visual summaries showing where your money really goes.
                  </span>
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

      <div className="flex flex-col w-full lg:w-1/2 justify-center p-8 lg:p-24 bg-background-dark animate-in fade-in duration-1000">
        <div className="max-w-md w-full mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <div className="h-1 flex-1 bg-white/5 rounded-full" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Enter Details</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Create your secure financial tracker</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSignup}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
              <div className="relative group">
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-2xl glass border border-white/5 text-black text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="Enter your name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">badge</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter your email:</label>
              <div className="relative group">
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-2xl glass border border-white/5 text-black text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Make a password</label>
              <div className="relative group">
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-2xl glass border border-white/5 text-black text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">fingerprint</span>
              </div>
            </div>

            <button
              type="submit"
              className="h-12 bg-primary text-background-dark font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 mt-6"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Already a member? <a className="text-primary font-black hover:text-white transition-colors" href="/login">Go to login</a>
          </p>
        </div>
      </div>
    </div>
  );
}