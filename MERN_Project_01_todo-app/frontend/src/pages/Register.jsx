import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, isAuthenticated, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (!result.success) toast.error(result.message);
    else toast.success('Account created! Welcome aboard 🎉');
  };

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', autoComplete: 'name' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'password', label: 'Password', type: showPassword ? 'text' : 'password', placeholder: '6+ characters', autoComplete: 'new-password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Same as above', autoComplete: 'new-password' },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-parchment rounded-full opacity-60" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-parchment rounded-full opacity-40" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-ink-900 rounded-2xl mb-4">
            <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-sans text-ink-900">Create account</h1>
          <p className="text-sm text-ink-400 mt-1">Start organizing your work with Taskr</p>
        </div>

        <div className="bg-white rounded-3xl shadow-paper-lg border border-ink-100 p-7">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fields.map(({ id, label, type, placeholder, autoComplete }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-xs font-mono font-semibold text-ink-500 uppercase tracking-widest mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={id}
                    type={type}
                    value={form[id]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full px-4 py-3.5 bg-white rounded-xl border text-ink-800 placeholder-ink-300 text-sm font-sans outline-none transition-all focus:ring-2 focus:ring-ember/20 focus:border-ember ${
                      errors[id] ? 'border-red-300' : 'border-ink-100 hover:border-dust'
                    }`}
                  />
                  {id === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {showPassword
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  )}
                </div>
                {errors[id] && <p className="mt-1.5 text-xs text-red-500">{errors[id]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-ink-900 text-cream text-sm font-sans font-semibold hover:bg-ember transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-ember font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
