import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  Square,
  MapPin,
  Heart,
  Scale,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';

export default function PropertyCard({ property, showScore = false }) {
  const { isSaved, toggleSave } = useSaved();
  const { isCompared, toggleCompare } = useCompare();

  if (!property) return null;

  const saved = isSaved(property._id);
  const compared = isCompared(property._id);

  const fallbackImage =
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80';
  const coverImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(property);
    if (!result.success && result.message) {
      alert(result.message);
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(property._id);
  };

  return (
    <div className="group relative bg-dark-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/[0.08] hover:border-cyan-500/40 shadow-card-dark hover:shadow-card-dark-hover transition-all duration-500 flex flex-col h-full">
      
      {/* Media Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-dark-950">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-95 group-hover:brightness-105"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/40 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {/* Price Badge */}
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-dark-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-glow-cyan">
              {property.priceDisplay}
            </span>

            {/* Property Type Badge */}
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
              {property.propertyType}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Toggle */}
            <button
              onClick={handleCompareClick}
              title={compared ? 'Remove from compare' : 'Add to compare'}
              className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                compared
                  ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-glow-cyan ring-1 ring-cyan-400'
                  : 'bg-dark-900/80 text-slate-300 hover:text-cyan-300 hover:bg-dark-800 border border-white/10'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={handleSaveClick}
              title={saved ? 'Remove from favorites' : 'Save property'}
              className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                saved
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                  : 'bg-dark-900/80 text-slate-300 hover:text-rose-400 hover:bg-dark-800 border border-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* AI Match Score Ribbon */}
        {showScore && property.matchScore && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white text-xs font-black shadow-glow-cyan backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-100 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{property.matchScore}% Match</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Locality */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>{property.location?.locality}, Hyderabad</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2.5">
            <Link to={`/properties/${property._id}`}>{property.title}</Link>
          </h3>

          {/* Specs: BHK, Area, Furnishing */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-dark-950/80 rounded-xl text-xs text-slate-300 mb-3 border border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{property.bhk} BHK</span>
            </div>
            <div className="flex items-center gap-1.5 border-x border-white/[0.08] px-2 justify-center">
              <Square className="w-3.5 h-3.5 text-purple-400" />
              <span>{property.area} sq.ft</span>
            </div>
            <div className="flex items-center justify-end truncate">
              <span className="text-[11px] text-slate-400 font-medium truncate">
                {property.furnishing}
              </span>
            </div>
          </div>

          {/* AI Match Explanation or Top Amenities */}
          {property.matchReasons && property.matchReasons.length > 0 ? (
            <div className="bg-gradient-to-br from-cyan-950/40 to-purple-950/30 border border-cyan-500/20 rounded-xl p-2.5 text-xs text-slate-200">
              <p className="font-bold flex items-center gap-1.5 text-cyan-300 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                Why this matches:
              </p>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                {property.matchReasons.join(' • ')}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(property.amenities || []).slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-0.5 rounded-md bg-dark-950 text-slate-300 border border-white/[0.06] text-[11px] font-medium"
                >
                  {amenity}
                </span>
              ))}
              {(property.amenities || []).length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-dark-950 text-slate-500 border border-white/[0.06] text-[11px]">
                  +{property.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500">Est. </span>
            <span className="font-bold text-slate-200">
              ₹{property.pricePerSqFt || Math.round(property.price / property.area)}
            </span>
            <span className="text-slate-500">/sq.ft</span>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
