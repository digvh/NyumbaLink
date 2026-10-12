// src/components/map/RouteLayer.tsx
'use client';

import { Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import type { Route } from '@/lib/routing';
import { formatMeters, formatDuration } from '@/lib/routing';

interface RouteLayerProps {
  route: Route | null;
  /** Follow the route fitBounds when route changes */
  fitBounds?: boolean;
}

const startIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 18px; height: 18px;
    border-radius: 9999px;
    background: #10b981;
    border: 3px solid #ffffff;
    box-shadow: 0 0 0 6px rgba(16,185,129,0.25);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const endIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 22px; height: 22px;
    border-radius: 9999px;
    background: #ef4444;
    border: 3px solid #ffffff;
    box-shadow: 0 4px 12px rgba(239,68,68,0.4);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 12px; font-weight: bold;
  ">★</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function RouteLayer({ route, fitBounds = true }: RouteLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!route || !fitBounds || route.geometry.length === 0) return;
    const bounds = L.latLngBounds(route.geometry.map(([lat, lng]) => L.latLng(lat, lng)));
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [route, fitBounds, map]);

  const positions = useMemo(() => route?.geometry ?? [], [route]);

  if (!route || positions.length === 0) return null;

  const start = positions[0];
  const end = positions[positions.length - 1];

  return (
    <>
      {/* White halo under the route */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#ffffff', weight: 10, opacity: 0.9 }}
      />
      {/* Main route line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#6366f1', weight: 6, opacity: 1 }}
      />

      <Marker position={start} icon={startIcon}>
        <Popup>Start</Popup>
      </Marker>

      <Marker position={end} icon={endIcon}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">Destination</p>
            <p className="text-gray-600">
              {formatMeters(route.distance)} · {formatDuration(route.duration)}
            </p>
          </div>
        </Popup>
      </Marker>
    </>
  );
}