import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  Building,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  ChevronRight,
  TrendingUp,
  MapPin,
  Bot,
  Zap,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [queryInput, setQueryInput] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [localityStats, setLocalityStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sampleQueries = [
    "I need a 2BHK apartment near HITEC City under ₹60 lakhs with good schools nearby.",
    "Show me 3BHK flats in Gachibowli under ₹70 lakhs in a gated community.",
    "Affordable 2BHK near Miyapur metro station under ₹45 lakhs.",
    "Luxury villa in Gachibowli with private garden and pool."
  ];

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [featRes, statsRes] = await Promise.all([
          api.get('/properties/featured'),
          api.get('/properties/locality-stats')
        ]);
        if (featRes.success) setFeaturedProperties(featRes.data);
        if (statsRes.success) setLocalityStats(statsRes.data);
      } catch (err) {
        console.warn('Failed to load homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    navigate(`/chat?q=${encodeURIComponent(queryInput.trim())}`);
  };

  const handleSampleQueryClick = (sample) => {
    navigate(`/chat?q=${encodeURIComponent(sample)}`);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-cyber-grid">
        {/* Ambient Glow Lights */}
        <div className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[350px] bg-gradient-to-bl from-purple-500/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-8 shadow-glow-cyan backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-Driven Real Estate Discovery</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
            Find Your Ideal Home Through <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
              Natural Dialogue
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Skip tedious filter checkboxes. Speak or type your budget, BHK, commute preferences, and amenities — HAVEN understands context and recommends verified Hyderabad homes.
          </p>

          {/* Conversational Search Box */}
          <div className="max-w-3xl mx-auto mb-10">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-dark-900/90 backdrop-blur-2xl rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-white/10 hover:border-cyan-500/40 focus-within:border-cyan-400 focus-within:shadow-glow-cyan transition-all duration-300"
            >
              <div className="pl-3.5 text-cyan-400">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask HAVEN... e.g., '2BHK in Gachibowli under ₹70L near metro and gym'"
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-dark-950 font-black text-sm sm:text-base shadow-glow-cyan transition-all duration-300 flex-shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 text-dark-950" />
              </button>
            </form>

            {/* Quick Sample Query Chips */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Try asking:
              </span>
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleQueryClick(sample)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-dark-900/80 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/30 transition-all truncate max-w-[280px] sm:max-w-none text-left cursor-pointer shadow-sm"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Counter */}
          <div className="pt-10 border-t border-white/[0.08] max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06] backdrop-blur-md">
              <p className="font-display font-black text-2xl sm:text-3xl text-white">20+ Listings</p>
              <p className="text-xs text-slate-400 mt-1">Verified Sample Properties</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06] backdrop-blur-md">
              <p className="font-display font-black text-2xl sm:text-3xl text-cyan-400">8 Tech Hubs</p>
              <p className="text-xs text-slate-400 mt-1">Hyderabad Localities</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06] backdrop-blur-md">
              <p className="font-display font-black text-2xl sm:text-3xl text-purple-400">100% Verified</p>
              <p className="text-xs text-slate-400 mt-1">Content-Based Scoring</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06] backdrop-blur-md">
              <p className="font-display font-black text-2xl sm:text-3xl text-teal-400">Zero Guesswork</p>
              <p className="text-xs text-slate-400 mt-1">Transparent Match Reasons</p>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Locations in Hyderabad */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
              <MapPin className="w-4 h-4" />
              <span>Hyderabad Prime Tech Corridor</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Explore Popular Localities
            </h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
          >
            <span>View All Hyderabad Localities</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {localityStats.slice(0, 6).map((stat) => (
            <Link
              key={stat.locality}
              to={`/properties?locality=${encodeURIComponent(stat.locality)}`}
              className="group bg-dark-900/80 backdrop-blur-xl rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-card-dark-hover transition-all duration-300 text-center flex flex-col items-center justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-purple-600 text-cyan-400 group-hover:text-dark-950 flex items-center justify-center transition-all duration-300 mb-3.5 shadow-sm">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                {stat.locality}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {stat.totalListings} {stat.totalListings === 1 ? 'Listing' : 'Listings'}
              </p>
              <span className="mt-2.5 text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                ~₹{stat.avgPricePerSqFt || 5200}/sq.ft
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-dark-900/50 border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Curated Showcase</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Featured Properties in Hyderabad
              </h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              <span>Explore All Listings in Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-dark-900 rounded-2xl h-80 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How HAVEN AI Works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
            Intelligent Cognitive Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white mt-2 mb-4">
            How HAVEN Conversational Search Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminating filter fatigue. Powered by deterministic extraction and multi-factor content matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-dark-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08] shadow-card-dark hover:border-cyan-500/40 hover:shadow-card-dark-hover transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-dark-950 flex items-center justify-center font-display font-black text-xl mb-6 shadow-glow-cyan">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2.5">
              Natural Language Intent
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Express budget in Lakhs or Crores, preferred locality, BHK layout, commute needs, and amenities in standard conversational sentences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-dark-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08] shadow-card-dark hover:border-purple-500/40 hover:shadow-card-dark-hover transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-display font-black text-xl mb-6 shadow-glow-purple">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2.5">
              Context & Clarification
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              HAVEN maintains conversational context across turns. If criteria are ambiguous, it asks targeted clarification questions without losing previous preferences.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-dark-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08] shadow-card-dark hover:border-cyan-500/40 hover:shadow-card-dark-hover transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-purple-600 text-dark-950 flex items-center justify-center font-display font-black text-xl mb-6 shadow-glow-cyan">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2.5">
              Content-Based Recommendations
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Real MongoDB listings are ranked using a multi-factor score (locality, budget, amenities, nearby facilities). Every match includes a transparent "Why this matches" explanation.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-gradient-to-r from-dark-900 via-purple-950/40 to-dark-900 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h3 className="font-display text-3xl sm:text-4xl font-black text-white">
              Ready to find your ideal home in Hyderabad?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Start chatting with HAVEN right now. No sign-up required to explore live conversational recommendations.
            </p>
            <div className="pt-2">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-dark-950 font-black text-base shadow-glow-cyan transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-dark-950" />
                <span>Launch Conversational Search</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
