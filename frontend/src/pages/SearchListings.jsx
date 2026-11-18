import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  RotateCcw,
  Building,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function SearchListings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedLocality, setSelectedLocality] = useState(searchParams.get('locality') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedBhk, setSelectedBhk] = useState(searchParams.get('bhk') || '');
  const [selectedFurnishing, setSelectedFurnishing] = useState('');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

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

  const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Independent House', 'Studio'];
  const bhkOptions = [1, 2, 3, 4];
  const commonAmenities = [
    'Gym',
    'Swimming Pool',
    'Clubhouse',
    'Power Backup',
    '24/7 Security',
    'Lift',
    'Covered Parking',
    'Children Play Area',
    'EV Charging Station'
  ];

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedLocality) params.append('locality', selectedLocality);
        if (selectedType) params.append('propertyType', selectedType);
        if (selectedBhk) params.append('bhk', selectedBhk);
        if (selectedFurnishing) params.append('furnishing', selectedFurnishing);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
        params.append('sortBy', sortBy);
        params.append('page', page);
        params.append('limit', 9);

        const res = await api.get(`/properties?${params.toString()}`);
        if (res.success) {
          setProperties(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.warn('Error fetching listings:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [
    searchTerm,
    selectedLocality,
    selectedType,
    selectedBhk,
    selectedFurnishing,
    maxPrice,
    selectedAmenities,
    sortBy,
    page
  ]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocality('');
    setSelectedType('');
    setSelectedBhk('');
    setSelectedFurnishing('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
              Explore Property Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing <span className="text-cyan-400 font-bold">{pagination.total || 0}</span> verified properties in Hyderabad
            </p>
          </div>

          {/* Quick search input */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search title, location, landmark..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-dark-900/90 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-white/10 bg-dark-900 text-slate-300 flex items-center gap-1.5 text-xs font-bold"
            >
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside
            className={`lg:block ${
              filterDrawerOpen ? 'block' : 'hidden'
            } bg-dark-900/90 backdrop-blur-2xl p-6 rounded-2xl border border-white/[0.08] shadow-card-dark h-fit space-y-6`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Catalog Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Locality */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Locality
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => {
                  setSelectedLocality(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2.5 rounded-xl border border-white/10 text-xs sm:text-sm bg-dark-950 text-slate-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan"
              >
                <option value="">All Hyderabad Localities</option>
                {localities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Pills */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {bhkOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setSelectedBhk(selectedBhk === String(num) ? '' : String(num));
                      setPage(1);
                    }}
                    className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      selectedBhk === String(num)
                        ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-dark-950 border-cyan-400 shadow-glow-cyan'
                        : 'bg-dark-950 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {num} BHK
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2.5 rounded-xl border border-white/10 text-xs sm:text-sm bg-dark-950 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Property Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Budget Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Max Budget
                </label>
                <span className="text-xs font-black text-cyan-400">
                  {maxPrice ? (maxPrice >= 10000000 ? `₹${(maxPrice / 10000000).toFixed(2)} Cr` : `₹${(maxPrice / 100000).toFixed(0)} Lakhs`) : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="3000000"
                max="40000000"
                step="500000"
                value={maxPrice || 40000000}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>₹30L</span>
                <span>₹1 Cr</span>
                <span>₹4 Cr</span>
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Furnishing
              </label>
              <select
                value={selectedFurnishing}
                onChange={(e) => {
                  setSelectedFurnishing(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2.5 rounded-xl border border-white/10 text-xs sm:text-sm bg-dark-950 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Any Furnishing</option>
                <option value="Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Amenities
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {commonAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded bg-dark-950 border-white/20 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Main Listings Grid (Span 3) */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Sorting & View Toggle Controls */}
            <div className="bg-dark-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/[0.08] shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="p-2 rounded-xl border border-white/10 text-xs font-bold text-white bg-dark-950 focus:outline-none focus:border-cyan-400"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Area: High to Low</option>
                </select>
              </div>

              {/* View toggle (Grid / List) */}
              <div className="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-dark-950">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-500 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-500 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Properties List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-dark-900 rounded-2xl h-80 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-dark-900/80 backdrop-blur-2xl rounded-2xl p-12 text-center border border-white/10 shadow-card-dark space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-glow-cyan">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  No properties matched your filters
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Try broadening your budget, clearing locality constraints, or using our AI conversational search to find smart alternatives.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-dark-950 font-black text-xs shadow-glow-cyan transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl border border-white/10 bg-dark-900 text-slate-300 disabled:opacity-30 hover:bg-dark-850 hover:border-cyan-500/30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-slate-300 px-4">
                  Page <span className="text-cyan-400">{page}</span> of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl border border-white/10 bg-dark-900 text-slate-300 disabled:opacity-30 hover:bg-dark-850 hover:border-cyan-500/30 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
