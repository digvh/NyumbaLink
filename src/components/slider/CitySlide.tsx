// src/components/slider/CitySlide.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';
import { Listing } from '@/types/listing';
import { CityInfo } from '@/utils/cities';
import CityCard from './CityCard';

interface CitySlideProps {
  city: CityInfo;
  listings: Listing[];
  isActive: boolean;
}

const CITY_POSTERS: Record<string, string> = {
  'Dar es Salaam':
    'https://images.unsplash.com/photo-1568708167166-2f4b5a0a5e64?w=1600&auto=format&fit=crop',
  Arusha:
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop',
  Mwanza:
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&auto=format&fit=crop',
  Dodoma:
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop',
  Zanzibar:
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&auto=format&fit=crop',
  Mbeya:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop',
  Moshi:
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop',
  Tanga:
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&auto=format&fit=crop',
};

export default function CitySlide({ city, listings, isActive }: CitySlideProps) {
  const poster = CITY_POSTERS[city.name] || CITY_POSTERS['Dar es Salaam'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full"
    >
      {/* Background Poster */}
      <div className="absolute inset-0">
        <Image
          src={poster}
          alt={city.name}
          fill
          className="object-cover"
          priority={isActive}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12">
        {/* City Title */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -30 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 font-semibold text-sm tracking-wider uppercase">
              {city.region}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            {city.name}
          </h2>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Top 5 picks in {city.name} — {listings.length}{' '}
            {listings.length === 1 ? 'property' : 'properties'} available
          </p>
        </motion.div>

        {/* Listings Carousel */}
        {listings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4 overflow-x-auto pb-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent',
            }}
          >
            {listings.map((listing, index) => (
              <CityCard key={listing.id} listing={listing} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 text-gray-300 text-lg"
          >
            <Building2 className="w-6 h-6" />
            <span>No listings in {city.name} yet. Check back soon!</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}