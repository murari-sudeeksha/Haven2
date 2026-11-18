import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Building,
  Users,
  MessageSquare,
  IndianRupee,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Command,
  Calendar,
  Phone
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locality: 'HITEC City',
    address: '',
    price: 6000000,
    bhk: 2,
    area: 1200,
    propertyType: 'Apartment',
    furnishing: 'Semi-Furnished',
    isGatedCommunity: true,
    amenities: 'Gym, Swimming Pool, Power Backup, 24/7 Security, Lift',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, usersRes, inqRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/properties?limit=50'),
        api.get('/admin/users'),
        api.get('/inquiries/all')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (propsRes.success) setProperties(propsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (inqRes?.success) setInquiries(inqRes.data || []);
    } catch (err) {
      console.warn('Admin load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingPropertyId(null);
    setFormData({
      title: '',
      description: '',
      locality: 'HITEC City',
      address: '',
      price: 6500000,
      bhk: 2,
      area: 1200,
      propertyType: 'Apartment',
      furnishing: 'Semi-Furnished',
      isGatedCommunity: true,
      amenities: 'Gym, Swimming Pool, Power Backup, 24/7 Security, Lift',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    });
    setPropertyModalOpen(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingPropertyId(prop._id);
    setFormData({
      title: prop.title,
      description: prop.description,
      locality: prop.location?.locality || 'HITEC City',
      address: prop.location?.address || '',
      price: prop.price,
      bhk: prop.bhk,
      area: prop.area,
      propertyType: prop.propertyType,
      furnishing: prop.furnishing,
      isGatedCommunity: prop.isGatedCommunity,
      amenities: (prop.amenities || []).join(', '),
      imageUrl: prop.images?.[0] || ''
    });
    setPropertyModalOpen(true);
  };

  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await api.delete(`/admin/properties/${id}`);
      if (res.success) {
        showNotification('Property listing deleted successfully.');
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        showNotification(`User role updated to ${newRole}.`);
        setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.success) {
        showNotification('User deleted successfully.');
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      bhk: Number(formData.bhk),
      area: Number(formData.area),
      propertyType: formData.propertyType,
      furnishing: formData.furnishing,
      isGatedCommunity: formData.isGatedCommunity,
      location: {
        locality: formData.locality,
        address: formData.address || `${formData.locality}, Hyderabad`,
        city: 'Hyderabad'
      },
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      images: [formData.imageUrl]
    };

    try {
      if (editingPropertyId) {
        const res = await api.put(`/admin/properties/${editingPropertyId}`, payload);
        if (res.success) {
          showNotification('Property updated successfully.');
        }
      } else {
        const res = await api.post('/admin/properties', payload);
        if (res.success) {
          showNotification('New property listing created!');
        }
      }
      setPropertyModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetSeedData = async () => {
    if (!window.confirm('Reset catalog to the default 20+ Hyderabad sample properties?')) return;
    try {
      const res = await api.post('/admin/reset-seed');
      if (res.success) {
        showNotification(res.message);
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-dark-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Command className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl text-white">
                  Admin Command Console
                </h1>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  RESTRICTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized real estate catalog management, user accounts, and system metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetSeedData}
              className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-cyan-500/30 bg-dark-950 text-slate-300 hover:text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to 22 Hyderabad demo records"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Catalog Seed</span>
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-dark-950 font-black text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-dark-950" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-glow-cyan">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-900/90 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-card-dark">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider">Properties</span>
              <Building className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white">{stats?.totalProperties || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Live in MongoDB catalog</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-card-dark">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider">Registered Users</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="font-display font-black text-2xl sm:text-3xl text-purple-300">{stats?.totalUsers || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Authenticated accounts</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-card-dark">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider">AI Conversations</span>
              <MessageSquare className="w-4 h-4 text-teal-400" />
            </div>
            <p className="font-display font-black text-2xl sm:text-3xl text-teal-300">{stats?.totalConversations || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Chat sessions tracked</p>
          </div>

          <div className="bg-dark-900/90 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-card-dark">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider">Average Price</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-display font-black text-2xl sm:text-3xl text-emerald-400">
              ₹{stats?.avgPrice ? (stats.avgPrice / 100000).toFixed(0) : 0} Lakhs
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Catalog baseline price</p>
          </div>
        </div>

        {/* Property Management Table */}
        <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark overflow-hidden">
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-white">Property Catalog Management</h2>
              <p className="text-xs text-slate-400 mt-0.5">Total {properties.length} active listings</p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 font-bold text-xs flex items-center gap-1 border border-cyan-500/30 cursor-pointer shadow-glow-cyan"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dark-950 border-b border-white/[0.08] text-slate-400 uppercase font-black text-[10px] tracking-wider">
                  <th className="p-4">Property</th>
                  <th className="p-4">Locality</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">BHK / Area</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-medium text-slate-300">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-bold text-white truncate max-w-xs">{prop.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {prop._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-cyan-400">{prop.location?.locality}</td>
                    <td className="p-4 font-black text-white">{prop.priceDisplay}</td>
                    <td className="p-4">{prop.bhk} BHK • {prop.area} sq.ft</td>
                    <td className="p-4">{prop.propertyType}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prop)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-dark-950 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop._id, prop.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete"
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

        {/* Registered Users Table */}
        <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark overflow-hidden">
          <div className="p-6 border-b border-white/[0.08]">
            <h2 className="font-display font-bold text-base sm:text-lg text-white">Registered Users Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">Accounts in HAVEN database ({users.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dark-950 border-b border-white/[0.08] text-slate-400 uppercase font-black text-[10px] tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">User Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-medium text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : u.role === 'seller'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                          className="bg-dark-950 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Site Visits & Inquiries Directory */}
        <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark overflow-hidden">
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Platform Site Visits & Inquiries</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Recorded tour requests across buyers and sellers ({inquiries.length})</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dark-950 border-b border-white/[0.08] text-slate-400 uppercase font-black text-[10px] tracking-wider">
                  <th className="p-4">Buyer Info</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Preferred Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-medium text-slate-300">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No site tour inquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <p className="font-bold text-white">{inq.name}</p>
                        <p className="text-slate-400 text-[11px] font-mono">{inq.phone} • {inq.email}</p>
                      </td>
                      <td className="p-4 font-medium">
                        <p className="text-white font-bold">{inq.property?.title || 'Unknown Property'}</p>
                        <p className="text-cyan-400 text-[11px]">{inq.property?.location?.locality}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">{inq.preferredDate}</td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Property Create/Edit Modal */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display font-bold text-base text-white">
                {editingPropertyId ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h3>
              <button onClick={() => setPropertyModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Skyline Towers - 3BHK Gated Home"
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of layout, fixtures, connectivity..."
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Locality</label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
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
                  <label className="font-bold text-slate-300 block mb-1">Price in INR</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="6500000"
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Bedrooms (BHK)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Furnishing</label>
                  <select
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Gym, Swimming Pool, Clubhouse, 24/7 Security..."
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-dark-950 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 font-bold hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-dark-950 font-black shadow-glow-cyan"
                >
                  {editingPropertyId ? 'Update Listing' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
