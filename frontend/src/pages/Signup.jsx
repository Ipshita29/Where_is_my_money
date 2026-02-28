import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      // FIX: backend route is /register, not /signup
      await api.post("/auth/register", { name, email, password });

      // Auto-login after registration
      const loginRes = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 md:px-20 py-4">
          <div className="flex items-center gap-3">
            <div className="text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">Alimony Finance</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block text-slate-500 dark:text-slate-400 text-sm">Already have an account?</p>
            <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              <span className="truncate">Log in</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-12 px-6 z-10">
          <div className="layout-content-container flex flex-col max-w-[560px] flex-1">
            {/* Progress Bar Component */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">Step 1 of 2</p>
                <p className="text-primary text-sm font-medium">Account Setup</p>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-primary/10">
                <div className="h-2 rounded-full bg-primary" style={{ width: "50%" }}></div>
              </div>
            </div>

            {/* Intro Text */}
            <div className="flex flex-col gap-3 mb-8">
              <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">Secure your financial future</h1>
              <p className="text-slate-600 dark:text-primary/70 text-base font-normal leading-normal">Professional-grade tools for managing and documenting alimony obligations.</p>
            </div>

            {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

            {/* Signup Form */}
            <form className="flex flex-col gap-6" onSubmit={handleSignup}>
              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Full Name</span>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                    <input
                      className="form-input block w-full rounded-xl border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all"
                      placeholder="John Doe"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Email Address</span>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                    <input
                      className="form-input block w-full rounded-xl border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all"
                      placeholder="name@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Password</span>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                    <input
                      className="form-input block w-full rounded-xl border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 pl-12 pr-12 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl cursor-pointer">visibility</span>
                  </div>
                </label>
              </div>

              {/* Goal Selection (Visual only) */}
              <div className="flex flex-col gap-4 mt-4">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">What is your primary goal?</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGoal('tracking')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${goal === 'tracking'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-primary/10 bg-transparent hover:border-primary/30'
                      }`}
                  >
                    <span className={`material-symbols-outlined ${goal === 'tracking' ? 'text-primary' : 'text-slate-400'}`}>analytics</span>
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-slate-100 text-sm font-bold">Tracking Alimony</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">Manage ongoing payments</span>
                    </div>
                    {goal === 'tracking' && <span className="material-symbols-outlined ml-auto text-primary text-xl">check_circle</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoal('evidence')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${goal === 'evidence'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-primary/10 bg-transparent hover:border-primary/30'
                      }`}
                  >
                    <span className={`material-symbols-outlined ${goal === 'evidence' ? 'text-primary' : 'text-slate-400'}`}>gavel</span>
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-slate-100 text-sm font-bold">Preparing Evidence</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">Documentation for court</span>
                    </div>
                    {goal === 'evidence' && <span className="material-symbols-outlined ml-auto text-primary text-xl">check_circle</span>}
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col gap-4 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  <span>{loading ? "Creating account..." : "Continue to Goals"}</span>
                  <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  By signing up, you agree to our <a className="text-primary underline" href="#">Terms of Service</a> and <a className="text-primary underline" href="#">Privacy Policy</a>. We use 256-bit encryption to secure your data.
                </p>
              </div>
            </form>
          </div>
        </main>

        {/* Footer Decorative */}
        <footer className="mt-auto py-8 flex flex-col items-center gap-4 opacity-50 z-10">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-xs font-medium">Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">encrypted</span>
              <span className="text-xs font-medium">End-to-End Encryption</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 z-0 w-1/3 h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[120px]"></div>
      </div>
      <div className="fixed bottom-0 left-0 z-0 w-1/3 h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary blur-[100px]"></div>
      </div>
    </div>
  );
}