import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Sparkles, ShieldCheck, Heart, MapPin, Cpu } from 'lucide-react';

export default function Footer() {
  const localities = [
    'HITEC City',
    'Gachibowli',
    'Kondapur',
    'Madhapur',
    'Miyapur',
    'Kukatpally',
    'Financial District',
    'Jubilee Hills'
  ];

  return (
    <footer className="bg-dark-950 text-slate-400 pt-16 pb-12 border-t border-white/[0.08] relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Disclaimer Banner */}
        <div className="mb-12 p-5 rounded-2xl bg-dark-900/80 border border-cyan-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-black/50">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>Verified Sample Inventory</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-extrabold uppercase">
                  DEMO CATALOG
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                HAVEN provides conversational AI property search across Hyderabad tech corridors. Listings represent verified evaluation properties.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Engine Online</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-glow-cyan">
                <div className="w-full h-full bg-dark-900 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                HAVEN
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Conversational real estate platform engineered for effortless home discovery. Talk naturally, explore intelligent recommendations, and compare properties side-by-side.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-dark-900 text-cyan-400 border border-cyan-500/30">
                React 19 & Vite
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-dark-900 text-purple-400 border border-purple-500/30">
                Tailwind CSS Dark
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-dark-900 text-teal-400 border border-teal-500/30">
                Deterministic NLP
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Explore HAVEN
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/chat" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  AI Conversational Search
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-cyan-400 transition-colors">
                  Property Listings
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cyan-400 transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-cyan-400 transition-colors">
                  Market Price Insights
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Buyer & Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Hyderabad Localities */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Hyderabad Tech Hubs
            </h4>
            <div className="flex flex-wrap gap-2">
              {localities.map((loc) => (
                <Link
                  key={loc}
                  to={`/properties?locality=${encodeURIComponent(loc)}`}
                  className="px-3 py-1.5 rounded-xl text-xs bg-dark-900/90 hover:bg-cyan-500/10 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/40 text-slate-300 transition-all duration-300"
                >
                  {loc}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-4">
              Click any locality to view live filtered real estate listings in Hyderabad.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HAVEN AI Real Estate. Sleek, Dark & Modern Property Intelligence.</p>
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="text-cyan-400 font-bold">HAVEN Cognitive Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
