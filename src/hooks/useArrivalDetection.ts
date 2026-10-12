// src/hooks/useArrivalDetection.ts
'use client';

import { useEffect, useState } from 'react';

interface Args {
  userLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  /** Trigger "arrived" when user is within this many meters (default 50) */
  thresholdMeters?: number;
}

/** Haversine distance between two lat/lng points, in meters */
export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function useArrivalDetection({
  userLocation,
  destination,
  thresholdMeters = 50,
}: Args) {
  const [arrived, setArrived] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  useEffect(() => {
    if (!userLocation || !destination) {
      setDistanceMeters(null);
      return;
    }
    const d = haversineMeters(userLocation, destination);
    setDistanceMeters(d);
    if (d <= thresholdMeters) {
      setArrived(true);
    }
  }, [userLocation?.lat, userLocation?.lng, destination?.lat, destination?.lng, thresholdMeters]);

  return { arrived, distanceMeters, reset: () => setArrived(false) };
}