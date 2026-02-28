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
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left Side: Login Form */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-background-light dark:bg-background-dark">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-white">account_balance</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight font-display">Alimony Finance</h2>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 font-display">Welcome Back</h1>
            <p className="text-slate-600 dark:text-primary/70 text-lg">Log in to manage your finances and legal evidence</p>
          </div>

          {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary/40">mail</span>
                <input
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold">Password</label>
                <a className="text-sm font-bold text-primary hover:underline" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary/40">lock</span>
                <input
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary dark:text-primary/40" type="button">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input className="w-5 h-5 rounded border-slate-300 dark:border-primary/30 text-primary focus:ring-primary bg-white dark:bg-transparent" id="remember" type="checkbox" />
              <label className="ml-3 text-slate-600 dark:text-slate-300 text-sm" htmlFor="remember">Keep me logged in</label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all text-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert("Google login integration coming soon!")}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-primary/20 rounded-xl hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors font-semibold"
            >
              <img alt="" className="w-5 h-5" data-alt="Google logo icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCREAkVtt8UnLUVqqaK-qbwMSu5Zx13Y5fcU7uToyu1boUuSQZBKEVY_1xSX7Jv2QUO7i1KD4BJke9h5OncRCrCe_n7kOJtneaBDXPkMnZwRoPU_BeUgm5zmiwJSFWwXKCL5iycT5Rp69ec_TL_hUqNw1PTMmx1x8BzpcqG3bFSkuMYD4LtDmTU1nlB019j_IhTyqnPqJ5XvMBHfhr1losZhXWyVXW0hLhPNam9jksjVSmKo1nDI_rzTn9LRGIHfwfQHF8QGg2joMrm" />
              Google
            </button>
            <button
              type="button"
              onClick={() => alert("Apple ID login integration coming soon!")}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-primary/20 rounded-xl hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-slate-900 dark:text-white">ios</span>
              Apple ID
            </button>
          </div>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Don't have an account? <a className="text-primary font-bold hover:underline" href="/signup">Create an account</a>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full -mr-96 -mt-96"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black rounded-full -ml-48 -mb-48"></div>
        </div>

        <div className="relative z-10 px-20 text-center max-w-2xl">
          <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl">
            <span className="material-symbols-outlined text-white text-5xl">gavel</span>
          </div>

          <h2 className="text-5xl font-black text-white mb-6 leading-tight">Court-ready evidence in one click.</h2>

          <p className="text-primary/10 bg-white/90 dark:bg-white text-slate-900 text-xl py-8 px-10 rounded-2xl shadow-2xl relative">
            <span className="material-symbols-outlined absolute -top-4 -left-4 text-4xl text-primary bg-white rounded-full p-2 shadow-lg">format_quote</span>
            "Alimony Finance turned a stressful legal process into a manageable digital task. All my reports were generated instantly for my counsel."
            <span className="block mt-6 font-bold text-primary">— Sarah J., Family Law Professional</span>
          </p>

          <div className="mt-16 flex justify-center gap-12">
            <div className="text-white text-center">
              <div className="text-4xl font-black mb-1">15k+</div>
              <div className="text-sm opacity-80 uppercase tracking-widest font-bold">Active Cases</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-white text-center">
              <div className="text-4xl font-black mb-1">99%</div>
              <div className="text-sm opacity-80 uppercase tracking-widest font-bold">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Abstract Gradient Overlay for Image Placeholder */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-primary/80 to-transparent"></div>
      </div>
    </div>
  );
}