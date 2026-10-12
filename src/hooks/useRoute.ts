// src/hooks/useRoute.ts
'use client';

import { useEffect, useState } from 'react';
import { getRoute, Route, TravelMode } from '@/lib/routing';

interface UseRouteArgs {
  from: { lat: number; lng: number } | null;
  to: { lat: number; lng: number } | null;
  mode?: TravelMode;
  enabled?: boolean;
  /** Refetch the route when this changes (e.g. user moved significantly) */
  refreshKey?: number;
}

export function useRoute({
  from,
  to,
  mode = 'driving',
  enabled = true,
  refreshKey = 0,
}: UseRouteArgs) {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !from || !to) {
      setRoute(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getRoute({ from, to, mode })
      .then((r) => {
        if (!cancelled) setRoute(r);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load route');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from?.lat, from?.lng, to?.lat, to?.lng, mode, enabled, refreshKey]);

  return { route, isLoading, error };
}