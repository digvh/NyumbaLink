// src/components/slider/CityCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Listing } from '@/types/listing';
import { formatPrice, getCategoryLabel } from '@/utils/helpers';

interface CityCardProps {
  listing: Listing;
  index: number;
}

export default function CityCard({ listing, index }: CityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="flex-shrink-0 w-72 rounded-3xl overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)] transition-all duration-300"
    >
      <Link href={`/listing/${listing.id}`}>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={listing.primaryPhoto || '/placeholder.jpg'}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
            sizes="288px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
            {getCategoryLabel(listing.category)}
          </span>

          {listing.averageRating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-xl">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-900">
                {listing.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-base mb-2 line-clamp-1 text-gray-900 dark:text-white">
            {listing.title}
          </h3>

          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-indigo-500" />
            <span className="truncate">
              {listing.district}, {listing.region}
            </span>
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-white/10">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              {formatPrice(listing.priceTzs)}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}