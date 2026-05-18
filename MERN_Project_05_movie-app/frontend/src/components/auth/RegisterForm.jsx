import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try { 
      await register({ username: form.username, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? errors.map((e) => e.msg).join(' ') : err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'cinefan42' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">{error}</div>
      )}
      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
          <input type={type} name={name} value={form[name]} onChange={handleChange} required
            placeholder={placeholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all" />
        </div>
      ))}
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold rounded-xl transition-colors duration-200">
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Sign in</Link>
      </p>
    </form>
  );
};
export default RegisterForm;
