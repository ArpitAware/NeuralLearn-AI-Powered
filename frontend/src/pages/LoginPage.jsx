import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };


  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-accent/10 blur-3xl top-0 right-0 animate-blob" />
        <div className="absolute w-80 h-80 rounded-full bg-accent2/10 blur-3xl bottom-10 left-0 animate-blob" style={{ animationDelay: '-3s' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(91,106,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,245,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          ← Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-xl mx-auto mb-4 animate-glow-pulse">N</div>
            <h1 className="font-head font-black text-2xl tracking-tight mb-1">Welcome back</h1>
            <p className="text-white/40 text-sm">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  className={`input pl-10 ${errors.email ? 'border-red-500/50' : ''}`}
                  type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors" onClick={() => setShow(s => !s)}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            New here?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
