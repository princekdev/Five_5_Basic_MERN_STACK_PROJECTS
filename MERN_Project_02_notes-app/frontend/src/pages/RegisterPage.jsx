import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return !Object.keys(errs).length;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Welcome to Inkwell.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const strength = (() => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 6) s++;
    if (form.password.length >= 10) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"][strength];

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-amber-500 text-3xl">✒</span>
          <h1 className="font-display text-3xl text-parchment-50 mt-2 mb-1">Create account</h1>
          <p className="text-ink-600 text-sm">Start your digital notebook today</p>
        </div>

        {errors.submit && (
          <div className="mb-4 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-ink-600 font-mono uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set("name")}
              autoComplete="name"
              className={`input-field ${errors.name ? "border-rose-500" : ""}`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
              className={`input-field ${errors.password ? "border-rose-500" : ""}`}
            />
            {form.password && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex gap-0.5 flex-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-ink-700"}`} />
                  ))}
                </div>
                <span className="text-xs text-ink-600">{strengthLabel}</span>
              </div>
            )}
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs text-ink-600 font-mono uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              autoComplete="new-password"
              className={`input-field ${errors.confirm ? "border-rose-500" : ""}`}
            />
            {errors.confirm && <p className="text-xs text-rose-400 mt-1">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                Creating account…
              </>
            ) : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
