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
      {/* Left Side: Marketing Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-20 overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] size-[500px] rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] size-[400px] rounded-full bg-black/20 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-lg w-full flex flex-col gap-12 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-white text-3xl">account_balance</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Alimony Finance</h2>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-5xl font-black leading-tight tracking-tighter">
              Precision Evidence.<br />
              <span className="text-white/60">Court-Ready Insight.</span>
            </h1>
            <p className="text-lg text-white/80 font-medium leading-relaxed">
              The industry standard for documenting alimony obligations and detecting financial anomalies with AI precision.
            </p>
          </div>

          <div className="glass border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-white opacity-40">format_quote</span>
            </div>
            <p className="text-white text-lg font-bold italic leading-relaxed mb-6">
              "This platform reduced our documentation time by 90%. The AI anomaly detection is a game-changer for legal evidence."
            </p>
            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="size-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-black text-xs uppercase">sj</div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">Sarah Jenkins</span>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none mt-1">Senior Counsel, Family Law</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">99.8%</span>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-1">Accuracy Rating</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">$2B+</span>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-1">Assets Analyzed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center p-8 lg:p-24 bg-background-dark animate-in fade-in duration-1000">
        <div className="max-w-md w-full mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Access Protocol</h3>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Vault Login</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Initialize authentication to review financial records</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-expense/20 bg-expense/5 text-expense text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
              <div className="relative group">
                <input
                  className="w-full h-14 pl-12 pr-4 rounded-2xl glass border border-white/5 text-white text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="name@agency.com"
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
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Passcode</label>
                <a className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors" href="#">Reset Key</a>
              </div>
              <div className="relative group">
                <input
                  className="w-full h-14 pl-12 pr-4 rounded-2xl glass border border-white/5 text-white text-xs font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">key</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <input className="size-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background-dark" id="remember" type="checkbox" />
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer" htmlFor="remember">Keep session persistent</label>
            </div>

            <button
              type="submit"
              className="h-14 bg-primary text-background-dark font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 mt-4"
              disabled={loading}
            >
              {loading ? "Decrypting..." : "Initialize Session"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-4 bg-background-dark text-slate-600">Alternate Uplink</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="h-12 flex items-center justify-center gap-2 border border-white/5 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <img alt="" className="size-4 opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCREAkVtt8UnLUVqqaK-qbwMSu5Zx13Y5fcU7uToyu1boUuSQZBKEVY_1xSX7Jv2QUO7i1KD4BJke9h5OncRCrCe_n7kOJtneaBDXPkMnZwRoPU_BeUgm5zmiwJSFWwXKCL5iycT5Rp69ec_TL_hUqNw1PTMmx1x8BzpcqG3bFSkuMYD4LtDmTU1nlB019j_IhTyqnPqJ5XvMBHfhr1losZhXWyVXW0hLhPNam9jksjVSmKo1nDI_rzTn9LRGIHfwfQHF8QGg2joMrm" />
              Uplink with Google
            </button>
            <button
              type="button"
              className="h-12 flex items-center justify-center gap-2 border border-white/5 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-lg opacity-60">ios</span>
              Apple Uplink
            </button>
          </div>

          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            First mission? <a className="text-primary font-black hover:text-white transition-colors" href="/signup">Establish Terminal</a>
          </p>
        </div>
      </div>
    </div>
  );
}