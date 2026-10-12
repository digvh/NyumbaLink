// src/components/listing/NavigateButton.tsx
'use client';

import { useState } from 'react';
import { Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Listing } from '@/types/listing';

interface NavigateButtonProps {
  listing: Listing;
}

export default function NavigateButton({ listing }: NavigateButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    setLoading(true);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      toast.error('Geolocation not supported on this device');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `/navigate?to=${listing.id}&fromLat=${latitude}&fromLng=${longitude}`;
        router.push(url);
      },
      () => {
        toast.error('Could not get your location. Please enable GPS.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <button
      onClick={handleNavigate}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition disabled:opacity-50"
    >
      <Navigation className="w-5 h-5" />
      {loading ? 'Getting location...' : 'Get Directions'}
    </button>
  );
}