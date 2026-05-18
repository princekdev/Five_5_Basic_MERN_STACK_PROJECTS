import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required
          placeholder="you@example.com"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required
          placeholder="••••••••"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold rounded-xl transition-colors duration-200">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Sign up</Link>
      </p>
    </form>
  );
};
export default LoginForm;
