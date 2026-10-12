// src/hooks/useLiveLocation.ts
'use client';

import { useEffect, useRef, useState } from 'react';

export interface LiveLocation {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

interface UseLiveLocationOptions {
  enabled?: boolean;
  highAccuracy?: boolean;
}

export function useLiveLocation(options: UseLiveLocationOptions = {}) {
  const { enabled = true, highAccuracy = true } = options;
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTracking(false);
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: highAccuracy,
        maximumAge: 1000,
        timeout: 15000,
      }
    );

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, highAccuracy]);

  return { location, error, isTracking };
}