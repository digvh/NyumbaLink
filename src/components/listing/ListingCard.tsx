// src/components/listing/ListingCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeCheck, Building2, Users } from 'lucide-react';
import { cn, formatPrice, formatDistance, getCategoryLabel, getCategoryColor } from '@/utils/helpers';
import type { Listing } from '@/types/listing';
import FavoriteButton from './FavoriteButton';

interface ListingCardProps {
  listing: Listing;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ListingCard({ listing, isSelected = false, onClick }: ListingCardProps) {
  const [imageError, setImageError] = useState(false);

  const photo =
    listing.primaryPhoto ||
    listing.photos?.find((p) => p.isPrimary)?.photoUrl ||
    listing.photos?.[0]?.photoUrl;

  const categoryLabel = getCategoryLabel(listing.category);
  const categoryColor = getCategoryColor(listing.category);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'w-full text-left rounded-3xl overflow-hidden',
        'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl',
        'border transition-all duration-300',
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-[0_12px_40px_0_rgba(99,102,241,0.35)]'
          : 'border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)]'
      )}
    >
      <Link href={`/listing/${listing.id}`} onClick={onClick} className="block">
        <div className="relative h-48 w-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
          {photo && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={listing.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-indigo-400/70" />
            </div>
          )}

          <div
            className={cn(
              'absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl',
              categoryColor
            )}
          >
            {categoryLabel}
          </div>

          {listing.featured && (
            <div className="absolute top-3 left-3 mt-8 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
              Featured
            </div>
          )}

          <div className="absolute top-3 right-3">
            <FavoriteButton listingId={listing.id} size="sm" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white leading-snug flex items-center gap-1.5">
              <span className="line-clamp-1">{listing.title}</span>
              {listing.isVerified && (
                <BadgeCheck className="w-4 h-4 text-indigo-500 shrink-0" />
              )}
            </h3>
          </div>

          <p className="text-lg font-bold gradient-text mb-2">
            {formatPrice(listing.priceTzs, 'TZS')}
          </p>

          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">
              {listing.address || listing.district || listing.region}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            {typeof listing.distanceMeters === 'number' && (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {formatDistance(listing.distanceMeters)}
              </span>
            )}
            {(typeof listing.averageRating === 'number' || listing.reviewCount) && (
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {listing.averageRating?.toFixed(1)}
                {listing.reviewCount ? ` (${listing.reviewCount})` : ''}
              </span>
            )}
          </div>

          {listing.owner?.fullName && (
            <div className="mt-3 pt-3 border-t border-white/30 dark:border-white/10 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Hosted by {listing.owner.fullName}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}