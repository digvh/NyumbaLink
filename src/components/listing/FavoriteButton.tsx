// src/components/listing/FavoriteButton.tsx
'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/utils/helpers';

export default function FavoriteButton({
  listingId,
  className,
  size = 'md',
}: {
  listingId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const active = isFavorite(listingId);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(listingId);
      }}
      aria-label={active ? 'Remove from favorites' : 'Save to favorites'}
      className={cn(
        'flex items-center justify-center rounded-full backdrop-blur-xl border shadow-lg transition-all',
        active
          ? 'bg-rose-500/90 border-rose-400 text-white'
          : 'bg-white/80 dark:bg-gray-900/80 border-white/40 text-gray-500 hover:text-rose-500',
        sizes[size],
        className
      )}
    >
      <Heart className={cn(iconSizes[size], active && 'fill-current')} />
    </motion.button>
  );
}
