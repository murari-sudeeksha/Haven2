import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Square,
  Bath,
  Compass,
  Building,
  Heart,
  Scale,
  CheckCircle2,
  Share2,
  Calendar,
  ShieldCheck,
  Send,
  Train,
  GraduationCap,
  Hospital,
  ShoppingBag,
  Briefcase,
  ChevronLeft,
  Sparkles,
  Bot
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const { isCompared, toggleCompare } = useCompare();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState(null);
  const [inquiryData, setInquiryData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    message: 'I am interested in scheduling a site visit for this property.'
  });

  useEffect(() => {
    if (user) {
      setInquiryData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const openInquiryModal = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to schedule a site tour and submit an inquiry.'
        }
      });
      return;
    }
    setInquiryError(null);
    setInquiryModalOpen(true);
  };

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.success && res.data) {
          setProperty(res.data);
          setSimilar(res.similar || []);
          setActiveImageIdx(0);
        }
      } catch (err) {
        console.warn('Failed to load property details:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-glow-cyan"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[70vh] bg-dark-950 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Property Not Found</h2>
        <p className="text-slate-400">The property you requested does not exist or has been removed.</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-dark-950 font-black text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(property._id);
  const compared = isCompared(property._id);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'];

  const getFacilityIcon = (type) => {
    switch (type) {
      case 'Metro':
        return <Train className="w-4 h-4 text-cyan-400" />;
      case 'School':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Hospital':
        return <Hospital className="w-4 h-4 text-rose-400" />;
      case 'Shopping Mall':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'IT Park':
        return <Briefcase className="w-4 h-4 text-teal-400" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError(null);
    setInquiryLoading(true);

    try {
      const res = await api.post('/inquiries', {
        propertyId: property._id,
        name: inquiryData.name,
        email: inquiryData.email || user?.email,
        phone: inquiryData.phone,
        preferredDate: inquiryData.preferredDate,
        message: inquiryData.message
      });

      if (res.success) {
        setInquirySuccess(true);
        setTimeout(() => {
          setInquiryModalOpen(false);
          setInquirySuccess(false);
        }, 2500);
      }
    } catch (err) {
      setInquiryError(err.message || 'Failed to submit site visit inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-cyan-400">Properties</Link>
          <span>/</span>
          <span className="text-cyan-400">{property.location?.locality}</span>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{property.title}</span>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-dark-900 relative shadow-2xl border border-white/10">
            <img
              src={images[activeImageIdx]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-dark-950/90 text-cyan-300 text-xs font-black backdrop-blur-xl border border-cyan-500/40 shadow-glow-cyan">
                {property.priceDisplay}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-600/90 text-white text-xs font-bold backdrop-blur-xl border border-white/20">
                {property.possessionStatus}
              </span>
            </div>
          </div>

          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] flex-shrink-0 lg:flex-shrink w-28 lg:w-full border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx ? 'border-cyan-400 shadow-glow-cyan' : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Overview Header & Actions */}
        <div className="bg-dark-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {property.propertyType}
              </span>
              <span className="text-xs text-slate-500 font-semibold">•</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{property.location?.address}, {property.location?.locality}, {property.location?.city}</span>
              </div>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {property.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right mr-3 hidden sm:block">
              <p className="text-2xl font-black text-white">{property.priceDisplay}</p>
              <p className="text-xs text-slate-400 font-mono">
                ₹{property.pricePerSqFt || Math.round(property.price / property.area)} / sq.ft
              </p>
            </div>

            <button
              onClick={() => toggleSave(property._id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                saved ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-500/20' : 'bg-dark-950 text-slate-300 border-white/10 hover:border-rose-400 hover:text-rose-400'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-rose-400' : ''}`} />
            </button>

            <button
              onClick={() => toggleCompare(property)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                compared ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan' : 'bg-dark-950 text-slate-300 border-white/10 hover:border-cyan-400 hover:text-cyan-300'
              }`}
              title="Compare property"
            >
              <Scale className="w-5 h-5" />
            </button>

            <button
              onClick={openInquiryModal}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-dark-950 font-black text-xs sm:text-sm shadow-glow-cyan transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-dark-950" />
              <span>Schedule Tour</span>
            </button>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/[0.08] text-center">
            <Bed className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-400">Bedrooms</p>
            <p className="font-bold text-white text-base mt-0.5">{property.bhk} BHK</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/[0.08] text-center">
            <Bath className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-400">Bathrooms</p>
            <p className="font-bold text-white text-base mt-0.5">{property.bathrooms || 2} Baths</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/[0.08] text-center">
            <Square className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-400">Super Area</p>
            <p className="font-bold text-white text-base mt-0.5">{property.area} sq.ft</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/[0.08] text-center">
            <Building className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-400">Furnishing</p>
            <p className="font-bold text-white text-sm mt-0.5 truncate">{property.furnishing}</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/[0.08] text-center">
            <Compass className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-400">Facing</p>
            <p className="font-bold text-white text-sm mt-0.5">{property.facing || 'East'}</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/[0.08] text-center">
            <ShieldCheck className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-400">Community</p>
            <p className="font-bold text-white text-sm mt-0.5">
              {property.isGatedCommunity ? 'Gated Society' : 'Independent'}
            </p>
          </div>
        </div>

        {/* Detailed Description & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-dark-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-4">
              <h2 className="font-display font-bold text-lg text-white">Property Overview</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
              {property.location?.landmarks && property.location.landmarks.length > 0 && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Key Landmarks Nearby
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {property.location.landmarks.map((landmark, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-dark-950 text-cyan-300 border border-white/[0.06] text-xs font-semibold">
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            <div className="bg-dark-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-4">
              <h2 className="font-display font-bold text-lg text-white">Amenities & Lifestyle Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(property.amenities || []).map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-dark-950/80 border border-white/[0.06] text-xs font-bold text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Facilities */}
            {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
              <div className="bg-dark-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-4">
                <h2 className="font-display font-bold text-lg text-white">
                  Nearby Facilities & Commute
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearbyFacilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950/80 border border-white/[0.06]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-dark-900 border border-white/[0.08]">
                          {getFacilityIcon(fac.facilityType)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">{fac.name}</p>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{fac.facilityType}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                        {fac.distanceKm} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Action / Contact Card (Span 1) */}
          <div className="space-y-6">
            <div className="bg-dark-900/90 backdrop-blur-2xl p-6 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-6 sticky top-28">
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                  Verified Sample Listing
                </span>
                <p className="text-2xl font-black text-white mt-1">{property.priceDisplay}</p>
                <p className="text-xs text-slate-400">Inclusive of base car parking & clubhouse</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/[0.06] text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Floor Elevation:</span>
                  <span className="font-bold text-slate-200">{property.floor || 'Middle Floors'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Pincode:</span>
                  <span className="font-bold text-slate-200">{property.location?.pincode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Listing Status:</span>
                  <span className="font-bold text-emerald-400">Available for Tour</span>
                </div>
              </div>

              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-dark-950 font-black text-xs sm:text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-dark-950" />
                <span>Book Site Tour</span>
              </button>

              <div className="text-center">
                <Link
                  to={`/chat?q=${encodeURIComponent(`Tell me more about ${property.title} in ${property.location.locality}`)}`}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask HAVEN AI about this listing</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="pt-10 border-t border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-white">
                Similar Properties in {property.location?.locality}
              </h2>
              <Link to="/properties" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                View All Listings
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((simProp) => (
                <PropertyCard key={simProp._id} property={simProp} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Schedule Visit Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-white">Schedule a Site Visit</h3>
                <p className="text-xs text-slate-400 truncate max-w-[260px]">{property.title}</p>
              </div>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inquiryError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                {inquiryError}
              </div>
            )}

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-glow-cyan">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Visit Request Confirmed!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your inquiry has been submitted and saved in your dashboard. The seller / property relationship manager will contact you on your registered phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      placeholder="vikram@example.com"
                      className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={inquiryData.preferredDate}
                    onChange={(e) => setInquiryData({ ...inquiryData, preferredDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Message / Questions</label>
                  <textarea
                    rows={2}
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 font-bold hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black shadow-glow-cyan transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {inquiryLoading ? 'Submitting Request...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
