import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Heart,
  Scale,
  LineChart,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count: savedCount } = useSaved();
  const { count: compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-xs lg:text-sm font-medium transition-all px-3 py-2 rounded-xl relative ${
      isActive
        ? 'text-cyan-300 bg-white/[0.06] border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
        : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-indigo-600 p-[1px] shadow-glow-cyan transition-all duration-300 group-hover:shadow-glow-purple">
              <div className="w-full h-full bg-dark-900 rounded-2xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-cyan-200 group-hover:to-purple-300 transition-all">
                  HAVEN
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block tracking-wide">
                Next-Gen Real Estate
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/chat" className={navLinkClass}>
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI Search</span>
              <span className="text-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-extrabold px-1.5 py-0.2 rounded-full shadow-sm">
                LIVE
              </span>
            </NavLink>

            <NavLink to="/properties" className={navLinkClass}>
              Explore Properties
            </NavLink>

            <NavLink to="/compare" className={navLinkClass}>
              <Scale className="w-4 h-4 text-slate-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center shadow-glow-cyan">
                  {compareCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/insights" className={navLinkClass}>
              <LineChart className="w-4 h-4 text-slate-400" />
              <span>Market Insights</span>
            </NavLink>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Saved properties button */}
            <Link
              to="/dashboard?tab=saved"
              className="relative p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-dark-850 hover:bg-dark-800 transition-all text-sm font-medium text-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-slate-200 font-semibold">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-dark-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-2.5 z-50 divide-y divide-white/[0.06]">
                    <div className="px-4 py-2.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
                        {user?.role} Portal
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                        Buyer / User Dashboard
                      </Link>

                      <Link
                        to="/dashboard?tab=seller"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-purple-400" />
                        Seller Portal
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors font-semibold"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Admin Command Center
                        </Link>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs lg:text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs lg:text-sm font-bold text-dark-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 px-4 py-2.5 rounded-xl shadow-glow-cyan hover:shadow-glow-purple transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/compare"
              className="relative p-2 rounded-xl text-slate-300"
              title="Compare"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-500 text-dark-950 text-[10px] font-black flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/[0.05]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-dark-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
          >
            Home
          </NavLink>
          <NavLink
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Conversational Search
          </NavLink>
          <NavLink
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
          >
            Explore Properties
          </NavLink>
          <NavLink
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
          >
            <Scale className="w-4 h-4 text-slate-400" />
            Compare Properties ({compareCount})
          </NavLink>
          <NavLink
            to="/insights"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
          >
            <LineChart className="w-4 h-4 text-slate-400" />
            Market Insights
          </NavLink>

          <div className="pt-3 border-t border-white/[0.08]">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  Dashboard ({user?.name})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/10"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Admin Command Center
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-white/10 text-sm font-bold text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 text-sm font-black shadow-glow-cyan"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
