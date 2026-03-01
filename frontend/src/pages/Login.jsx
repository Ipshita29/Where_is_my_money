import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. System access denied.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-background-dark font-display text-white overflow-hidden">
   
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-20 overflow-hidden">

        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] size-[500px] rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] size-[400px] rounded-full bg-black/20 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-lg w-full flex flex-col gap-12 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-white text-3xl">account_balance</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Where is my money?</h2>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-5xl font-black leading-tight tracking-tighter">
              Digital Money Tracker.<br />
              <span className="text-white/60">Financial Trace Intelligence.</span>
            </h1>
            <p className="text-lg text-white/80 font-medium leading-relaxed">
              Track. Analyze. Discover. Know exactly where your money moves.
            </p>
          </div>

          <div className="glass border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-white opacity-40">format_quote</span>
            </div>
            <p className="text-white text-lg font-bold italic leading-relaxed mb-6">
              "AI-powered insights to reveal hidden spending and unexpected financial behavior."
            </p>
            
          </div>

          
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center p-8 lg:p-24 bg-background-dark animate-in fade-in duration-1000">
        <div className="max-w-md w-full mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Finance Tracker</h3>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Login</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Initialize authentication to review financial records</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Email:</label>
              <div className="relative group">
                <input
                  className="w-full h-14 pl-12 pr-4 rounded-2xl glass border border-white/5 text-black text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">terminal</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Password:</label>
              </div>
              <div className="relative group">
                <input
                  className="w-full h-14 pl-12 pr-4 rounded-2xl glass border border-white/5 text-black text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="Enter Your Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">key</span>
              </div>
            </div>

            <button
              type="submit"
              className="h-14 bg-primary text-background-dark font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 mt-4"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            New here? <a className="text-primary font-black hover:text-white transition-colors" href="/signup">Create Your Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}