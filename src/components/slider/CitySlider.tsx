// src/components/slider/CitySlider.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TANZANIA_CITIES, findNearestCity } from '@/utils/cities';
import { mockListings } from '@/data/mockListings';
import { Listing } from '@/types/listing';
import CitySlide from './CitySlide';

const AUTO_ROTATE_INTERVAL = 8000; // 8 seconds

export default function CitySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userCity, setUserCity] = useState<string | null>(null);

  // Detect user's nearest city
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      // Default to Dar es Salaam
      setUserCity('Dar es Salaam');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestCity(
          position.coords.latitude,
          position.coords.longitude
        );
        setUserCity(nearest.name);

        const index = TANZANIA_CITIES.findIndex((c) => c.name === nearest.name);
        if (index >= 0) {
          setActiveIndex(index);
        }
      },
      () => {
        // Default to Dar es Salaam
        setUserCity('Dar es Salaam');
        const index = TANZANIA_CITIES.findIndex((c) => c.name === 'Dar es Salaam');
        if (index >= 0) setActiveIndex(index);
      }
    );
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TANZANIA_CITIES.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TANZANIA_CITIES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + TANZANIA_CITIES.length) % TANZANIA_CITIES.length
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // ✅ CRITICAL: Filter listings by city name
  const getListingsForCity = (cityName: string): Listing[] => {
    return mockListings
      .filter(
        (listing) =>
          listing.city?.toLowerCase() === cityName.toLowerCase()
      )
      .sort((a, b) => {
        // Sort by featured first, then by rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      })
      .slice(0, 5); // Top 5 only
  };

  const currentCity = TANZANIA_CITIES[activeIndex];
  const currentListings = getListingsForCity(currentCity.name);

  return (
    <section
      className="relative w-full h-[600px] md:h-[700px] lg:h-[750px] overflow-hidden rounded-3xl shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <CitySlide
            city={currentCity}
            listings={currentListings}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* User Location Badge */}
      {userCity && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">
            Your area: {userCity}
          </span>
        </motion.div>
      )}

      {/* Prev Button */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
        aria-label="Previous city"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
        aria-label="Next city"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {TANZANIA_CITIES.map((city, index) => (
          <button
            key={city.name}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to ${city.name}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          key={activeIndex}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? '0%' : '100%' }}
          transition={{
            duration: isPaused ? 0 : AUTO_ROTATE_INTERVAL / 1000,
            ease: 'linear',
          }}
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        />
      </div>
    </section>
  );
}