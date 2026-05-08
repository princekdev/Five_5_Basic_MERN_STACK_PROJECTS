import React, { useState } from "react";
import { X, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const InputField = ({ icon: Icon, type, placeholder, value, onChange, showToggle, onToggle, show }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
      <Icon size={15} />
    </div>
    <input
      type={showToggle ? (show ? "text" : "password") : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange} 
      required
      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 focus:border-white/20 transition-all"
    />
    {showToggle && (
      <button type="button" onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    )}
  </div>
);

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login, register } = useAuth();

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        toast.success("Welcome back!");
      } else {
        await register(form);
        toast.success("Account created! Welcome aboard 🎉");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-display font-bold text-xl">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-white/40 text-xs font-body mt-0.5">
              {mode === "login" ? "Sign in to save your searches" : "Join to track your weather history"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors rounded-xl hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <InputField icon={User} type="text" placeholder="Username" value={form.username} onChange={handleChange("username")} />
          )}
          <InputField icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={handleChange("email")} />
          <InputField icon={Lock} type="password" placeholder="Password" value={form.password}
            onChange={handleChange("password")} showToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />

          <button type="submit" disabled={loading}
            className="w-full py-3 mt-2 bg-white/15 hover:bg-white/25 disabled:opacity-50 border border-white/10 hover:border-white/20 rounded-xl text-white font-display font-semibold text-sm transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-white/40 text-xs font-body">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="ml-1.5 text-white/70 hover:text-white font-semibold transition-colors">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
