import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[350px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[350px] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] mx-auto shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="font-display font-black text-3xl text-white">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-400">
            Join HAVEN for conversational property discovery in Hyderabad.
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
              <label className="font-bold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-dark-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan text-sm transition-all"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-dark-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Select Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-2.5 rounded-xl border font-black transition-all text-xs cursor-pointer ${
                    role === 'buyer' || role === 'user'
                      ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-dark-950 border-cyan-400 shadow-glow-cyan'
                      : 'bg-dark-950 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-2.5 rounded-xl border font-black transition-all text-xs cursor-pointer ${
                    role === 'seller'
                      ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                      : 'bg-dark-950 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  Seller
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl border font-black transition-all text-xs cursor-pointer ${
                    role === 'admin'
                      ? 'bg-amber-500 text-dark-950 border-amber-400 shadow-lg shadow-amber-500/30'
                      : 'bg-dark-950 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-dark-950 font-black text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4 text-dark-950" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
