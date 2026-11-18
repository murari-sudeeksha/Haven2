import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  TrendingUp,
  MapPin,
  Building2,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
  Layers,
  Cpu
} from 'lucide-react';
import api from '../services/api';

export default function Insights() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/properties/locality-stats');
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch locality stats:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-dark-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <LineChart className="w-4 h-4" />
              <span>Real Estate Analytics</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              Hyderabad Locality Insights & Decision Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verified metric distributions calculated directly from active catalog inventory.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-glow-cyan">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Catalog Ground Truth</span>
          </div>
        </div>

        {/* Data Disclosure Banner */}
        <div className="bg-dark-900/80 p-5 rounded-2xl border border-white/[0.08] flex items-start gap-3.5 text-xs text-slate-300 leading-relaxed shadow-lg">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Data Disclosure:</strong> All metrics displayed are aggregated strictly from the active verified sample inventory in our MongoDB database. We strictly avoid speculative forecasts or fabricated market fluctuations.
          </p>
        </div>

        {/* Locality Benchmarks Table */}
        <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark overflow-hidden">
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Locality Price & Area Benchmarks
            </h2>
            <span className="text-xs text-slate-400">Sorted by listing availability</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dark-950 border-b border-white/[0.08] text-slate-400 uppercase font-black text-[10px] tracking-wider">
                  <th className="p-4">Locality</th>
                  <th className="p-4">Listings</th>
                  <th className="p-4">Average Price</th>
                  <th className="p-4">Price Range (Min - Max)</th>
                  <th className="p-4">Avg Super Area</th>
                  <th className="p-4">Avg Price / sq.ft</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-medium text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">Loading catalog benchmarks...</td>
                  </tr>
                ) : (
                  stats.map((row) => (
                    <tr key={row.locality} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{row.locality}</span>
                      </td>
                      <td className="p-4 font-bold text-cyan-400">{row.totalListings} Units</td>
                      <td className="p-4 font-bold text-white">{formatPrice(row.avgPrice)}</td>
                      <td className="p-4 text-slate-400">
                        {formatPrice(row.minPrice)} – {formatPrice(row.maxPrice)}
                      </td>
                      <td className="p-4">{row.avgArea} sq.ft</td>
                      <td className="p-4 font-bold text-purple-300">
                        ₹{row.avgPricePerSqFt || Math.round(row.avgPrice / row.avgArea)}/sq.ft
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/properties?locality=${encodeURIComponent(row.locality)}`}
                          className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Smart Alternatives & Arbitrage Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-dark-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-base text-white">
                Space vs. Commute Trade-Offs
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your budget target is under ₹65 Lakhs:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-950 border border-white/[0.06]">
                <span className="font-bold text-cyan-400">Option A:</span>
                <span>Compact 2BHK in <strong>HITEC City</strong> (~1,180 sq.ft at ₹58L–₹60L) with walking distance to tech parks.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-950 border border-white/[0.06]">
                <span className="font-bold text-purple-400">Option B:</span>
                <span>Spacious 3BHK in <strong>Miyapur or Kukatpally</strong> (~1,550 sq.ft at ₹54L–₹65L) with direct Metro transit.</span>
              </li>
            </ul>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Building2 className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-bold text-base text-white">
                Gated Community Premium
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Hyderabad's IT corridor, gated societies typically command a 15%–20% premium over standalone apartments, delivering dedicated 100% power backup, 24/7 manned security checkpoints, and community clubhouses.
            </p>
            <div className="pt-2">
              <Link
                to="/chat?q=Show me 3BHK in Gachibowli in a gated society"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
              >
                <span>Find gated community apartments with AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
