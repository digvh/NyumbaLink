// src/components/map/OfflineCachedTileLayer.tsx
'use client';

import { useEffect } from 'react';
import { TileLayer, useMapEvents } from 'react-leaflet';
import type { TileLayerProps } from 'react-leaflet';
import { setupTileCache } from '@/lib/offlineMap';

/**
 * TileLayer that caches every tile it loads via the Cache API.
 * Uses a Service Worker + Cache to make tiles available offline.
 */
export default function OfflineCachedTileLayer(props: TileLayerProps) {
  useEffect(() => {
    setupTileCache();
  }, []);

  return <TileLayer {...props} />;
}