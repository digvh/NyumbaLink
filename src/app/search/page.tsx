// src/app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ChevronDown,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useSearchStore } from '@/store/searchStore';
import { useUIStore } from '@/store/uiStore';
import { ListingCategory } from '@/types/listing';
import Loading from '@/components/ui/Loading';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import GlassCard from '@/components/ui/GlassCard';
import { mockListings } from '@/data/mockListings';

// Dynamic imports
const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => <Loading text="Loading map..." />,
});

const ListingCard = dynamic(() => import('@/components/listing/ListingCard'), {
  loading: () => <div className="animate-pulse bg-white/50 backdrop-blur-xl rounded-3xl h-64" />,
});

export default function SearchPage() {
  const {
    location,
    radius,
    maxPrice,
    minPrice,
    category,
    sortBy,
    currency,
    setLocation,
    setMaxPrice,
    setMinPrice,
    setCategory,
    setSortBy,
    toggleCurrency,
  } = useSearchStore();
  const { isBottomSheetOpen, toggleBottomSheet } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get user location.
  // Guarantees a location (geolocation if available, otherwise a default
  // Dar es Salaam position) so the search query always runs and listings are
  // visible even when the browser blocks geolocation or no API backend is set.
  useEffect(() => {
    if (!location) {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          },
          () => {
            setLocation({ lat: -6.7924, lng: 39.2083 });
          }
        );
      } else {
        setLocation({ lat: -6.7924, lng: 39.2083 });
      }
    }
  }, [location, setLocation]);

  // Fetch listings (API with mock fallback so the page works without a backend)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['listings', location, radius, maxPrice, minPrice, category, sortBy],
    queryFn: async () => {
      try {
        const res = await apiService.searchNearby({
          lat: location?.lat,
          lng: location?.lng,
          radius,
          minPrice,
          maxPrice,
          category,
          sortBy,
        });
        const body = res.data;
        const apiList = body?.listings ?? body?.data?.listings ?? [];
        if (Array.isArray(apiList) && apiList.length > 0) return { listings: apiList };
        throw new Error('empty');
      } catch {
        const { mockListings } = await import('@/data/mockListings');
        let list = [...mockListings];
        if (category) list = list.filter((l) => l.category === category);
        list = list.filter((l) => l.priceTzs >= minPrice && l.priceTzs <= maxPrice);
        if (sortBy === 'price_asc') list.sort((a, b) => a.priceTzs - b.priceTzs);
        else if (sortBy === 'price_desc') list.sort((a, b) => b.priceTzs - a.priceTzs);
        else if (sortBy === 'rating') list.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
        else if (sortBy === 'distance') list.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
        return { listings: list };
      }
    },
    enabled: !!location,
  });

  const listings = data?.listings || [];

  const categories = [
    { value: null, label: 'All', icon: '🏠' },
    { value: 'HOTEL', label: 'Hotels', icon: '🏨' },
    { value: 'LODGE', label: 'Lodges', icon: '🏡' },
    { value: 'SELF_CONTAINED_ROOM', label: 'Rooms', icon: '🚪' },
    { value: 'BAR', label: 'Bars', icon: '🍺' },
    { value: 'RESTAURANT', label: 'Restaurants', icon: '🍽️' },
    { value: 'LAND', label: 'Land', icon: '🌍' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="flex h-screen relative z-10">
        {/* Listings Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full md:w-[480px] glass-sidebar flex flex-col ${
            isBottomSheetOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          {/* Search Header */}
          <div className="p-5 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <GlassInput
                  type="text"
                  placeholder="Search location..."
                  icon={<Search className="w-5 h-5" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <GlassButton
                variant="glass"
                size="md"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                icon={<SlidersHorizontal className="w-4 h-4" />}
              >
                Filters
              </GlassButton>
              <GlassButton variant="gradient" size="md" onClick={toggleCurrency}>
                {currency}
              </GlassButton>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <motion.button
                  key={cat.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat.value as ListingCategory | null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    category === cat.value
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-white/30 dark:border-white/10 hover:bg-white/80'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Range Quick Filter */}
          <div className="px-5 py-3 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Price Range
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {maxPrice.toLocaleString()} TZS max
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={10000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-white/40 dark:bg-gray-700/40 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Results Count */}
          <div className="px-5 py-3 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Searching...
                </span>
              ) : (
                <>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {listings.length}
                  </span>{' '}
                  properties found
                </>
              )}
            </p>
          </div>

          {/* Listings List */}
          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loading text="Finding properties..." />
              </div>
            ) : error ? (
              <GlassCard className="text-center py-8">
                <p className="text-red-500 mb-4">Failed to load properties</p>
                <GlassButton onClick={() => refetch()}>Retry</GlassButton>
              </GlassCard>
            ) : listings.length === 0 ? (
              <GlassCard className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {error ? 'Failed to load live listings' : 'No listings found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error ? (
                    <>
                      Live listings are unavailable right now. Showing
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400"> sample listings (no login required).</span>
                    </>
                  ) : (
                    <>
                      Try widening your search radius or use the category filters
                      below.
                    </>
                  )}
                </p>
                {error ? (
                  <GlassButton onClick={() => (refetch as () => void)()} variant="gradient">
                    Refresh (sample listings)
                  </GlassButton>
                ) : (
                  <GlassButton onClick={() => setCategory(null)} variant="gradient">
                    Clear Filters
                  </GlassButton>
                )}
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {listings.map((listing: any, index: number) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListingCard
                      listing={listing}
                      isSelected={selectedListing === listing.id}
                      onClick={() => setSelectedListing(listing.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Map */}
        <div className="flex-1 relative">
          <PropertyMap
            listings={listings}
            selectedListing={selectedListing}
            onSelectListing={setSelectedListing}
            userLocation={location}
          />

          {/* Mobile Toggle */}
          <button
            onClick={toggleBottomSheet}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-2xl shadow-purple-500/50 z-10"
          >
            {isBottomSheetOpen ? 'Show Map' : 'Show List'}
          </button>
        </div>
      </div>
    </div>
  );
}