import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  X,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin,
  IndianRupee,
  Bed,
  Square,
  Building,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';

export default function Compare() {
  const { comparedProperties, removeFromCompare, clearCompare, toggleCompare } = useCompare();

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      if (comparedProperties.length < 2) {
        setAnalysis(null);
        return;
      }
      setLoadingAnalysis(true);
      try {
        const ids = comparedProperties.map(p => p._id);
        const res = await api.post('/recommendations/compare', { propertyIds: ids });
        if (res.success) {
          setAnalysis(res.analysis);
        }
      } catch (err) {
        console.warn('Failed to load comparison analysis:', err.message);
      } finally {
        setLoadingAnalysis(false);
      }
    }
    fetchAnalysis();
  }, [comparedProperties]);

  const openAddModal = async () => {
    try {
      const res = await api.get('/properties?limit=15');
      if (res.success) {
        setAvailableProperties(res.data);
      }
    } catch (err) {
      console.warn(err);
    }
    setAddModalOpen(true);
  };

  const allAmenities = [
    'Gym',
    'Swimming Pool',
    'Clubhouse',
    'Power Backup',
    '24/7 Security',
    'Lift',
    'Covered Parking',
    'Children Play Area',
    'EV Charging Station',
    'Landscaped Garden',
    'Tennis Court'
  ];

  if (comparedProperties.length === 0) {
    return (
      <div className="min-h-[70vh] bg-dark-950 py-16 flex items-center justify-center text-white">
        <div className="max-w-md w-full bg-dark-900/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-glow-cyan">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-2xl text-white">
            No Properties to Compare
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Select 2 to 4 properties across our catalog to view side-by-side matrices, amenities checklists, and AI trade-off analysis.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/properties"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black text-xs sm:text-sm shadow-glow-cyan transition-all"
            >
              Browse Property Listings
            </Link>
            <button
              onClick={openAddModal}
              className="py-2.5 px-6 rounded-xl border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/[0.05]"
            >
              Quick Add From Available Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-900/90 backdrop-blur-2xl p-6 rounded-2xl border border-white/[0.08] shadow-card-dark">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>Side-by-Side Matrix</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              Comparing {comparedProperties.length} Properties
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                highlightDifferences
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-dark-950 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {highlightDifferences ? 'Highlighting Differences' : 'Highlight Differences'}
            </button>

            {comparedProperties.length < 4 && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-bold text-xs flex items-center gap-1.5 transition-colors border border-cyan-500/30 cursor-pointer shadow-glow-cyan"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            )}

            <button
              onClick={clearCompare}
              className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold text-xs hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* AI Trade-Off Analysis Banner */}
        {analysis && (
          <div className="bg-gradient-to-r from-dark-900 via-purple-950/40 to-dark-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-cyan-500/20 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  HAVEN AI Decision Support & Trade-Off Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Synthesized evaluation across price-per-sq.ft, layout volume, and community specifications.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {analysis.tradeOffs?.map((trade, idx) => (
                <div
                  key={idx}
                  className="bg-dark-950/80 rounded-xl p-4 border border-white/[0.08] space-y-1.5"
                >
                  <p className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                    {trade.factor}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">{trade.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Matrix Table */}
        <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-dark-950/60">
                <th className="p-4 w-48 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Features
                </th>
                {comparedProperties.map((prop) => (
                  <th key={prop._id} className="p-4 w-64 align-top">
                    <div className="space-y-3 relative">
                      <button
                        onClick={() => removeFromCompare(prop._id)}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-dark-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-950 border border-white/10">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-cyan-400 font-bold mt-0.5">
                          {prop.location?.locality}
                        </p>
                        <p className="text-base font-black text-white mt-1">
                          {prop.priceDisplay}
                        </p>
                      </div>
                      <Link
                        to={`/properties/${prop._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-white/[0.06]">
              
              {/* Price per sq ft */}
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-slate-400">Price / sq.ft</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 font-bold text-slate-200">
                    ₹{prop.pricePerSqFt || Math.round(prop.price / prop.area)}/sq.ft
                  </td>
                ))}
              </tr>

              {/* BHK */}
              <tr className={highlightDifferences ? 'bg-amber-500/10 hover:bg-amber-500/20' : 'hover:bg-white/[0.02]'}>
                <td className="p-4 font-bold text-slate-400">BHK Layout</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 font-black text-cyan-300">
                    {prop.bhk} BHK
                  </td>
                ))}
              </tr>

              {/* Property Type */}
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-slate-400">Property Type</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 font-semibold text-slate-300">
                    {prop.propertyType}
                  </td>
                ))}
              </tr>

              {/* Area */}
              <tr className={highlightDifferences ? 'bg-amber-500/10 hover:bg-amber-500/20' : 'hover:bg-white/[0.02]'}>
                <td className="p-4 font-bold text-slate-400">Super Area</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 font-bold text-white">
                    {prop.area} sq.ft
                  </td>
                ))}
              </tr>

              {/* Furnishing */}
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-slate-400">Furnishing</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 text-slate-300">
                    {prop.furnishing}
                  </td>
                ))}
              </tr>

              {/* Gated Community */}
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-slate-400">Gated Society</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 font-semibold">
                    {prop.isGatedCommunity ? (
                      <span className="text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">Yes</span>
                    ) : (
                      <span className="text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">Independent</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Address */}
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-slate-400">Address Details</td>
                {comparedProperties.map((prop) => (
                  <td key={prop._id} className="p-4 text-slate-300 leading-relaxed">
                    {prop.location?.address}
                  </td>
                ))}
              </tr>

              {/* Amenities Section Header */}
              <tr className="bg-dark-950">
                <td colSpan={comparedProperties.length + 1} className="p-3 font-display font-black text-cyan-400 uppercase text-[10px] tracking-wider">
                  Community & Society Amenities
                </td>
              </tr>

              {allAmenities.map((amenity) => (
                <tr key={amenity} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-slate-300 font-medium">{amenity}</td>
                  {comparedProperties.map((prop) => {
                    const hasAmenity = (prop.amenities || []).some(
                      a => a.toLowerCase().includes(amenity.toLowerCase()) || amenity.toLowerCase().includes(a.toLowerCase())
                    );
                    return (
                      <td key={prop._id} className="p-4">
                        {hasAmenity ? (
                          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Included</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <XCircle className="w-4 h-4" />
                            <span>—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

            </tbody>
          </table>
        </div>

      </div>

      {/* Quick Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-white/10 max-h-[80vh] flex flex-col text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display font-bold text-base text-white">Add Property to Compare</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06] py-2">
              {availableProperties
                .filter(p => !comparedProperties.some(cp => cp._id === p._id))
                .map((prop) => (
                  <div key={prop._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={prop.images?.[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-xs text-white">{prop.title}</p>
                        <p className="text-[11px] text-slate-400">{prop.location?.locality} • {prop.priceDisplay} • {prop.bhk} BHK</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toggleCompare(prop);
                        setAddModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-dark-950 text-xs font-black cursor-pointer shadow-glow-cyan"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
