import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Scale,
  Sparkles,
  History,
  Settings,
  Building,
  CheckCircle2,
  Trash2,
  ArrowRight,
  MapPin,
  IndianRupee,
  Plus,
  Send,
  UploadCloud,
  Edit2,
  Calendar,
  Phone,
  Mail,
  Clock,
  ShieldAlert,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const { savedIds, toggleSave } = useSaved();
  const { comparedProperties, removeFromCompare } = useCompare();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isSeller = user?.role === 'seller';
  const isAdmin = user?.role === 'admin';
  const isBuyer = !isSeller && !isAdmin;

  const defaultTab = isSeller ? 'seller' : 'overview';
  const activeTab = searchParams.get('tab') || defaultTab;

  const [savedPropertiesList, setSavedPropertiesList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [buyerInquiries, setBuyerInquiries] = useState([]);

  // Seller States
  const [sellerProperties, setSellerProperties] = useState([]);
  const [sellerInquiries, setSellerInquiries] = useState([]);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerActionMsg, setSellerActionMsg] = useState(null);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [sellerFormSubmitting, setSellerFormSubmitting] = useState(false);

  const initialSellerForm = {
    title: '',
    locality: 'Gachibowli',
    address: '',
    price: '',
    bhk: 2,
    area: 1200,
    propertyType: 'Apartment',
    furnishing: 'Semi-Furnished',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    description: '',
    amenities: 'Gym, Swimming Pool, Power Backup, 24/7 Security, Lift'
  };
  const [sellerForm, setSellerForm] = useState(initialSellerForm);

  const [loading, setLoading] = useState(true);

  // Profile edit states
  const [name, setName] = useState(user?.name || '');
  const [preferredLocality, setPreferredLocality] = useState(
    user?.lifestylePreferences?.preferredLocalities?.[0] || 'HITEC City'
  );
  const [budgetMax, setBudgetMax] = useState(
    user?.lifestylePreferences?.budgetMax ? user.lifestylePreferences.budgetMax / 100000 : 70
  );
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const showSellerNotification = (msg) => {
    setSellerActionMsg(msg);
    setTimeout(() => setSellerActionMsg(null), 4000);
  };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (isSeller || isAdmin) {
        setSellerLoading(true);
        const [propsRes, inqRes] = await Promise.all([
          api.get('/seller/properties'),
          api.get('/seller/inquiries')
        ]);
        if (propsRes.success) setSellerProperties(propsRes.data || []);
        if (inqRes.success) setSellerInquiries(inqRes.data || []);
        setSellerLoading(false);
      }

      // Load Buyer Data
      const [savedRes, convRes, recsRes, buyerInqRes] = await Promise.all([
        api.get('/user/saved'),
        api.get('/user/conversations'),
        api.get('/user/recommendations'),
        api.get('/inquiries/my')
      ]);

      if (savedRes.success) setSavedPropertiesList(savedRes.data || []);
      if (convRes.success) setConversations(convRes.data || []);
      if (recsRes.success) setPersonalizedRecs(recsRes.recommendations || []);
      if (buyerInqRes.success) setBuyerInquiries(buyerInqRes.data || []);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [savedIds, user?.role]);

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', {
        name,
        lifestylePreferences: {
          preferredLocalities: [preferredLocality],
          budgetMax: Number(budgetMax) * 100000
        }
      });
      if (res.success) {
        updateUser(res.user);
        setProfileSavedMsg(true);
        setTimeout(() => setProfileSavedMsg(false), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Seller CRUD Handlers
  const handleOpenCreateModal = () => {
    setEditingPropertyId(null);
    setSellerForm(initialSellerForm);
    setListingModalOpen(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingPropertyId(prop._id);
    setSellerForm({
      title: prop.title,
      locality: prop.location?.locality || 'Gachibowli',
      address: prop.location?.address || '',
      price: prop.price,
      bhk: prop.bhk,
      area: prop.area,
      propertyType: prop.propertyType || 'Apartment',
      furnishing: prop.furnishing || 'Semi-Furnished',
      imageUrl: prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      description: prop.description || '',
      amenities: Array.isArray(prop.amenities) ? prop.amenities.join(', ') : (prop.amenities || '')
    });
    setListingModalOpen(true);
  };

  const handleDeleteListing = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete listing "${title}"?`)) return;
    try {
      const res = await api.delete(`/seller/properties/${id}`);
      if (res.success) {
        showSellerNotification('Listing deleted successfully.');
        setSellerProperties(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  const handleSellerFormSubmit = async (e) => {
    e.preventDefault();
    setSellerFormSubmitting(true);

    const payload = {
      title: sellerForm.title,
      description: sellerForm.description,
      location: {
        locality: sellerForm.locality,
        address: sellerForm.address || `${sellerForm.locality}, Hyderabad`,
        city: 'Hyderabad'
      },
      price: Number(sellerForm.price),
      bhk: Number(sellerForm.bhk),
      area: Number(sellerForm.area),
      propertyType: sellerForm.propertyType,
      furnishing: sellerForm.furnishing,
      amenities: sellerForm.amenities.split(',').map(a => a.trim()).filter(Boolean),
      images: [sellerForm.imageUrl]
    };

    try {
      if (editingPropertyId) {
        const res = await api.put(`/seller/properties/${editingPropertyId}`, payload);
        if (res.success) {
          showSellerNotification('Property listing updated successfully!');
          setListingModalOpen(false);
          loadDashboardData();
        }
      } else {
        const res = await api.post('/seller/properties', payload);
        if (res.success) {
          showSellerNotification('Property published successfully to the HAVEN marketplace!');
          setListingModalOpen(false);
          loadDashboardData();
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to save property listing.');
    } finally {
      setSellerFormSubmitting(false);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const res = await api.put(`/seller/inquiries/${inquiryId}/status`, { status: newStatus });
      if (res.success) {
        showSellerNotification(`Tour status updated to ${newStatus}.`);
        setSellerInquiries(prev =>
          prev.map(inq => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update tour status.');
    }
  };

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Banner HUD */}
        <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/[0.08] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-16 h-16 rounded-2xl font-display font-black text-2xl flex items-center justify-center ${
              isSeller
                ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                : isAdmin
                ? 'bg-amber-500 text-dark-950 shadow-lg shadow-amber-500/30'
                : 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-dark-950 shadow-glow-cyan'
            }`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl text-white">
                  {user?.name}
                </h1>
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                  isSeller
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : isAdmin
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                }`}>
                  {user?.role} Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Member active since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 relative z-10">
            {isSeller ? (
              <>
                <div className="bg-dark-950/80 rounded-2xl p-3 px-5 text-center border border-white/[0.06] backdrop-blur-md">
                  <p className="font-display font-black text-xl text-purple-400">{sellerProperties.length}</p>
                  <p className="text-[11px] text-slate-400">My Listings</p>
                </div>
                <div className="bg-dark-950/80 rounded-2xl p-3 px-5 text-center border border-white/[0.06] backdrop-blur-md">
                  <p className="font-display font-black text-xl text-cyan-400">{sellerInquiries.length}</p>
                  <p className="text-[11px] text-slate-400">Buyer Leads</p>
                </div>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/30 hover:opacity-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Property</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-dark-950/80 rounded-2xl p-3 px-5 text-center border border-white/[0.06] backdrop-blur-md">
                  <p className="font-display font-black text-xl text-cyan-400">{savedPropertiesList.length}</p>
                  <p className="text-[11px] text-slate-400">Favorites</p>
                </div>
                <div className="bg-dark-950/80 rounded-2xl p-3 px-5 text-center border border-white/[0.06] backdrop-blur-md">
                  <p className="font-display font-black text-xl text-purple-400">{conversations.length}</p>
                  <p className="text-[11px] text-slate-400">Chats</p>
                </div>
                <div className="bg-dark-950/80 rounded-2xl p-3 px-5 text-center border border-white/[0.06] backdrop-blur-md">
                  <p className="font-display font-black text-xl text-emerald-400">{buyerInquiries.length}</p>
                  <p className="text-[11px] text-slate-400">Site Tours</p>
                </div>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>

        {/* Global Notification Banner */}
        {sellerActionMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-glow-cyan animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{sellerActionMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] gap-3 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
          {/* Seller Tabs */}
          {isSeller && (
            <>
              <button
                onClick={() => setTab('seller')}
                className={`pb-3 px-3.5 transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'seller'
                    ? 'border-purple-400 text-purple-300 shadow-[0_2px_10px_rgba(168,85,247,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4 text-purple-400" />
                <span>My Property Listings ({sellerProperties.length})</span>
              </button>
              <button
                onClick={() => setTab('leads')}
                className={`pb-3 px-3.5 transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'leads'
                    ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(6,182,212,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Buyer Inquiries & Leads ({sellerInquiries.length})</span>
              </button>
            </>
          )}

          {/* Buyer Tabs */}
          {!isSeller && (
            <>
              <button
                onClick={() => setTab('overview')}
                className={`pb-3 px-3.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(6,182,212,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Buyer Overview & AI Picks
              </button>
              <button
                onClick={() => setTab('saved')}
                className={`pb-3 px-3.5 transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'saved'
                    ? 'border-rose-400 text-rose-300 shadow-[0_2px_10px_rgba(244,63,94,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Saved Favorites ({savedPropertiesList.length})</span>
              </button>
              <button
                onClick={() => setTab('tours')}
                className={`pb-3 px-3.5 transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'tours'
                    ? 'border-emerald-400 text-emerald-300 shadow-[0_2px_10px_rgba(16,185,129,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Scheduled Site Tours ({buyerInquiries.length})</span>
              </button>
              <button
                onClick={() => setTab('searches')}
                className={`pb-3 px-3.5 transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'searches'
                    ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(6,182,212,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4 text-cyan-400" />
                <span>Chat History ({conversations.length})</span>
              </button>
            </>
          )}

          {/* Common Tab */}
          <button
            onClick={() => setTab('preferences')}
            className={`pb-3 px-3.5 transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-teal-400 text-teal-300 shadow-[0_2px_10px_rgba(20,184,166,0.3)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Profile & Settings</span>
          </button>
        </div>

        {/* Tab 1: Buyer Overview & AI Recommendations */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>Personalized For You</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recommended properties based on your saved favorites and preferred locality.
                  </p>
                </div>
                <Link to="/chat" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                  Refine with AI Chat →
                </Link>
              </div>

              {personalizedRecs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {personalizedRecs.map((prop) => (
                    <PropertyCard key={prop._id} property={prop} showScore={true} />
                  ))}
                </div>
              ) : (
                <div className="bg-dark-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 text-center space-y-3">
                  <p className="text-sm text-slate-400">Save a few properties or chat with HAVEN to generate recommendations!</p>
                  <Link
                    to="/chat"
                    className="inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black text-xs shadow-glow-cyan"
                  >
                    Start AI Search
                  </Link>
                </div>
              )}
            </div>

            {comparedProperties.length > 0 && (
              <div className="bg-dark-900/90 backdrop-blur-2xl p-6 rounded-2xl border border-white/[0.08] shadow-card-dark space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>Currently Compared Properties ({comparedProperties.length})</span>
                  </h3>
                  <Link to="/compare" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                    Open Full Matrix →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {comparedProperties.map((cp) => (
                    <div key={cp._id} className="p-3 rounded-xl border border-white/[0.06] bg-dark-950 flex items-center justify-between">
                      <div className="truncate">
                        <p className="font-bold text-xs text-white truncate">{cp.title}</p>
                        <p className="text-[11px] text-cyan-400">{cp.priceDisplay} • {cp.bhk} BHK</p>
                      </div>
                      <button
                        onClick={() => removeFromCompare(cp._id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Favorites */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white">
              Your Saved Properties ({savedPropertiesList.length})
            </h2>
            {savedPropertiesList.length === 0 ? (
              <div className="bg-dark-900/80 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No properties saved yet.</p>
                <p className="text-xs text-slate-400">Click the heart icon on any property card to save it here for easy access.</p>
                <Link
                  to="/properties"
                  className="inline-flex mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black text-xs shadow-glow-cyan"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPropertiesList.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Buyer Scheduled Site Tours */}
        {activeTab === 'tours' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Your Scheduled Site Visits ({buyerInquiries.length})</span>
            </h2>
            {buyerInquiries.length === 0 ? (
              <div className="bg-dark-900/80 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No site visits scheduled yet.</p>
                <p className="text-xs text-slate-400">Click "Schedule Tour" on any property details page to book a real visit.</p>
                <Link
                  to="/properties"
                  className="inline-flex mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black text-xs shadow-glow-cyan"
                >
                  Explore Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyerInquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className="bg-dark-900/90 backdrop-blur-2xl p-5 rounded-2xl border border-white/[0.08] shadow-card-dark flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {inq.property?.images?.[0] && (
                        <img
                          src={inq.property.images[0]}
                          alt={inq.property.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-white/10"
                        />
                      )}
                      <div className="space-y-1">
                        <Link
                          to={`/properties/${inq.property?._id}`}
                          className="font-bold text-white text-sm hover:text-cyan-400 transition-colors line-clamp-1"
                        >
                          {inq.property?.title || 'Property Tour'}
                        </Link>
                        <p className="text-xs text-cyan-400 font-mono">
                          {inq.property?.priceDisplay} • {inq.property?.location?.locality}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Visit Date: <strong className="text-white">{inq.preferredDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Tour Status:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          inq.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : inq.status === 'Completed'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : inq.status === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <Link
                        to={`/properties/${inq.property?._id}`}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                      >
                        <span>View Listing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Buyer Search History */}
        {activeTab === 'searches' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white">
              Conversational Sessions & Recent Queries
            </h2>
            {conversations.length === 0 ? (
              <div className="bg-dark-900/80 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center space-y-3">
                <History className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No past conversation sessions found.</p>
                <Link
                  to="/chat"
                  className="inline-flex mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black text-xs shadow-glow-cyan"
                >
                  Start New AI Search
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className="bg-dark-900/80 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-card-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{conv.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(conv.lastActiveAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {conv.messages?.length || 0} messages exchanged
                        {conv.extractedPreferences?.locality ? ` • Target: ${conv.extractedPreferences.locality}` : ''}
                      </p>
                    </div>

                    <Link
                      to={`/chat?sessionId=${conv.sessionId}`}
                      className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-dark-850 text-cyan-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Resume Conversation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Seller Properties Management (Full CRUD) */}
        {activeTab === 'seller' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-400" />
                  <span>My Active Property Listings ({sellerProperties.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage, add, update, or remove your residential listings directly from MongoDB.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/30 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Listing</span>
              </button>
            </div>

            {sellerProperties.length === 0 ? (
              <div className="bg-dark-900/80 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center space-y-3">
                <Building className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-200">You haven't listed any properties yet.</p>
                <p className="text-xs text-slate-400">Click below to publish your first property for buyers in Hyderabad.</p>
                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs shadow-lg shadow-purple-500/30 cursor-pointer"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-card-dark">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-4">Property</th>
                        <th className="p-4">Locality</th>
                        <th className="p-4">BHK / Area</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-slate-300">
                      {sellerProperties.map((prop) => (
                        <tr key={prop._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'}
                                alt={prop.title}
                                className="w-12 h-12 rounded-lg object-cover border border-white/10"
                              />
                              <div>
                                <Link
                                  to={`/properties/${prop._id}`}
                                  className="font-bold text-white hover:text-cyan-400 line-clamp-1"
                                >
                                  {prop.title}
                                </Link>
                                <span className="text-[10px] text-slate-500">{prop.propertyType}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-300">{prop.location?.locality}</td>
                          <td className="p-4 font-medium">{prop.bhk} BHK • {prop.area} sq.ft</td>
                          <td className="p-4 font-bold text-cyan-400 font-mono">{prop.priceDisplay}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {prop.status || 'Available'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/properties/${prop._id}`}
                                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white"
                                title="View in catalog"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleOpenEditModal(prop)}
                                className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 cursor-pointer"
                                title="Edit listing"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteListing(prop._id, prop.title)}
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 cursor-pointer"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Seller Buyer Leads & Tours */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>Buyer Inquiries & Leads ({sellerInquiries.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Prospective buyers interested in viewing your properties. Update tour confirmation statuses here.
              </p>
            </div>

            {sellerInquiries.length === 0 ? (
              <div className="bg-dark-900/80 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center space-y-3">
                <Phone className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No buyer inquiries received yet.</p>
                <p className="text-xs text-slate-400">When interested buyers schedule visits on your listings, their details appear here.</p>
              </div>
            ) : (
              <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-card-dark">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-4">Buyer Name & Contact</th>
                        <th className="p-4">Property</th>
                        <th className="p-4">Preferred Date</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-slate-300">
                      {sellerInquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-white/[0.02]">
                          <td className="p-4">
                            <p className="font-bold text-white">{inq.name}</p>
                            <p className="text-slate-400 text-[11px] font-mono">{inq.phone}</p>
                            <p className="text-slate-500 text-[11px]">{inq.email}</p>
                          </td>
                          <td className="p-4 font-medium">
                            <Link
                              to={`/properties/${inq.property?._id}`}
                              className="text-cyan-400 hover:text-cyan-300 font-bold line-clamp-1"
                            >
                              {inq.property?.title || 'Listing'}
                            </Link>
                            <span className="text-[11px] text-slate-500">{inq.property?.location?.locality}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">{inq.preferredDate}</td>
                          <td className="p-4 max-w-xs text-slate-400 italic">"{inq.message || 'No additional notes.'}"</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              inq.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : inq.status === 'Completed'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : inq.status === 'Cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {inq.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {inq.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq._id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold cursor-pointer"
                                >
                                  Confirm
                                </button>
                              )}
                              {inq.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq._id, 'Completed')}
                                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[11px] font-bold cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              {inq.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq._id, 'Cancelled')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Preferences & Profile */}
        {activeTab === 'preferences' && (
          <div className="bg-dark-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark max-w-2xl space-y-6">
            <h2 className="font-display font-bold text-xl text-white">
              Lifestyle & Profile Settings
            </h2>

            {profileSavedMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950/50 text-slate-400 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Role: {user?.role}</span>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Preferred Locality</label>
                <select
                  value={preferredLocality}
                  onChange={(e) => setPreferredLocality(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="HITEC City">HITEC City</option>
                  <option value="Gachibowli">Gachibowli</option>
                  <option value="Kondapur">Kondapur</option>
                  <option value="Madhapur">Madhapur</option>
                  <option value="Miyapur">Miyapur</option>
                  <option value="Kukatpally">Kukatpally</option>
                  <option value="Financial District">Financial District</option>
                  <option value="Jubilee Hills">Jubilee Hills</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Target Budget (Max): ₹{budgetMax} Lakhs
                </label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>₹20 Lakhs</span>
                  <span>₹1.5 Cr</span>
                  <span>₹3.0 Cr</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black shadow-glow-cyan cursor-pointer"
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Seller Listing Add / Edit Modal */}
      {listingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {editingPropertyId ? 'Edit Property Listing' : 'Publish New Property Listing'}
                </h3>
                <p className="text-xs text-slate-400">Listing will be active in HAVEN database catalog.</p>
              </div>
              <button
                onClick={() => setListingModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSellerFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={sellerForm.title}
                  onChange={(e) => setSellerForm({ ...sellerForm, title: e.target.value })}
                  placeholder="e.g. Prestige High Fields - 3BHK Lakeview Flat"
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={sellerForm.description}
                  onChange={(e) => setSellerForm({ ...sellerForm, description: e.target.value })}
                  placeholder="Describe your property, layout, tower name, nearby landmarks..."
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Locality</label>
                  <select
                    value={sellerForm.locality}
                    onChange={(e) => setSellerForm({ ...sellerForm, locality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="HITEC City">HITEC City</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Kondapur">Kondapur</option>
                    <option value="Madhapur">Madhapur</option>
                    <option value="Miyapur">Miyapur</option>
                    <option value="Kukatpally">Kukatpally</option>
                    <option value="Financial District">Financial District</option>
                    <option value="Jubilee Hills">Jubilee Hills</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Expected Price (in INR)</label>
                  <input
                    type="number"
                    required
                    value={sellerForm.price}
                    onChange={(e) => setSellerForm({ ...sellerForm, price: e.target.value })}
                    placeholder="7500000"
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Bedrooms (BHK)</label>
                  <select
                    value={sellerForm.bhk}
                    onChange={(e) => setSellerForm({ ...sellerForm, bhk: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    value={sellerForm.area}
                    onChange={(e) => setSellerForm({ ...sellerForm, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Property Type</label>
                  <select
                    value={sellerForm.propertyType}
                    onChange={(e) => setSellerForm({ ...sellerForm, propertyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Furnishing</label>
                  <select
                    value={sellerForm.furnishing}
                    onChange={(e) => setSellerForm({ ...sellerForm, furnishing: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Cover Photo URL</label>
                <input
                  type="url"
                  required
                  value={sellerForm.imageUrl}
                  onChange={(e) => setSellerForm({ ...sellerForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={sellerForm.amenities}
                  onChange={(e) => setSellerForm({ ...sellerForm, amenities: e.target.value })}
                  placeholder="Gym, Swimming Pool, Power Backup, 24/7 Security"
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setListingModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 font-bold hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sellerFormSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black shadow-lg shadow-purple-500/30 cursor-pointer disabled:opacity-50"
                >
                  {sellerFormSubmitting ? 'Saving...' : editingPropertyId ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
