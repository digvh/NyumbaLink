// src/app/favorites/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { apiService } from '@/lib/api';
import { mockListings } from '@/data/mockListings';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import Loading from '@/components/ui/Loading';
import ListingCard from '@/components/listing/ListingCard';
import type { Listing } from '@/types/listing';

export default function FavoritesPage() {
  const { favoriteIds, clearFavorites } = useFavoritesStore();

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ['favorites', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      try {
        const res = await apiService.getFavorites();
        const body = res.data;
        const apiList: Listing[] =
          body?.data ?? body?.favorites ?? body?.listings ?? [];
        if (apiList.length > 0) return apiList;
        throw new Error('empty');
      } catch {
        return mockListings.filter((l) => favoriteIds.includes(l.id));
      }
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="blob w-96 h-96 bg-rose-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-pink-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
              Saved Homes
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {favoriteIds.length} {favoriteIds.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          {favoriteIds.length > 0 && (
            <GlassButton variant="outline" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={clearFavorites}>
              Clear all
            </GlassButton>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loading text="Loading favorites..." size="lg" /></div>
        ) : listings.length === 0 ? (
          <GlassCard padding="lg" className="text-center py-16">
            <div className="text-6xl mb-4">💗</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No saved properties yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Tap the heart on any listing to save it here.</p>
            <Link href="/search"><GlassButton variant="gradient" size="lg">Browse Properties</GlassButton></Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing, i) => (
              <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
