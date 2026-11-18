import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Sparkles, Lock, Mail, ArrowRight, ShieldAlert, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.message || null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[350px] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] mx-auto shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="font-display font-black text-3xl text-white">
            Welcome to HAVEN
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access personalized recommendations, saved properties, and search history.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-900/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-card-dark space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-dark-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-dark-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-dark-950 font-black text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-dark-950" />
            </button>
          </form>

          {/* Quick Demo Login Presets */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user@haven.ai', 'User@1234')}
                className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Buyer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller@haven.ai', 'Seller@1234')}
                className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Seller</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@haven.ai', 'Admin@1234')}
                className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
