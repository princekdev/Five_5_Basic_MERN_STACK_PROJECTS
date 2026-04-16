import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return !Object.keys(errs).length;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-ink-900 border-r border-ink-800 p-10">
        <div>
          <span className="text-amber-500 text-2xl">✒</span>
          <span className="font-display text-xl text-parchment-50 ml-2">Inkwell</span>
        </div>
        <div>
          <blockquote className="font-display italic text-2xl text-parchment-50/80 leading-relaxed mb-6">
            "The palest ink is better than the best memory."
          </blockquote>
          <p className="text-ink-600 text-sm">— Chinese Proverb</p>
        </div>
        <div className="flex flex-col gap-3">
          {["Capture every thought", "Organize by category", "Search instantly", "Yours alone"].map((feat) => (
            <div key={feat} className="flex items-center gap-2.5 text-sm text-parchment-200/50">
              <span className="text-amber-500">◆</span> {feat}
            </div>
          ))}
        </div>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <span className="text-amber-500 text-3xl">✒</span>
            <h1 className="font-display text-2xl text-parchment-50 mt-1">Inkwell</h1>
          </div>

          <h2 className="font-display text-3xl text-parchment-50 mb-1">Welcome back</h2>
          <p className="text-ink-600 text-sm mb-8">Sign in to your notebook</p>

          {errors.submit && (
            <div className="mb-4 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-ink-600 font-mono uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                className={`input-field ${errors.email ? "border-rose-500" : ""}`}
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs text-ink-600 font-mono uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                autoComplete="current-password"
                className={`input-field ${errors.password ? "border-rose-500" : ""}`}
              />
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-ink-600 mt-6">
            No account?{" "}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
