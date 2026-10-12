// src/components/map/NavigationMap.tsx
'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Route } from '@/lib/routing';
import LiveTracker from './LiveTracker';
import RouteLayer from './RouteLayer';
import OfflineCachedTileLayer from './OfflineCachedTileLayer';
import type { LiveLocation } from '@/hooks/useLiveLocation';

interface NavigationMapProps {
  userLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  route: Route | null;
  destinationTitle?: string;
  followUser?: boolean;
}

function FollowController({
  userLocation,
  follow,
}: {
  userLocation: { lat: number; lng: number } | null;
  follow: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (!follow || !userLocation) return;
    map.panTo([userLocation.lat, userLocation.lng], {
      animate: true,
      duration: 0.5,
    });
  }, [userLocation?.lat, userLocation?.lng, follow, map]);
  return null;
}

const destIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 26px; height: 26px;
    border-radius: 9999px;
    background: #ef4444;
    border: 3px solid #ffffff;
    box-shadow: 0 4px 12px rgba(239,68,68,0.5);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 14px; font-weight: bold;
  ">★</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export default function NavigationMap({
  userLocation,
  destination,
  route,
  destinationTitle,
  followUser = true,
}: NavigationMapProps) {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : destination
    ? [destination.lat, destination.lng]
    : [-6.7924, 39.2083];

  const liveLoc: LiveLocation | null = userLocation
    ? {
        lat: userLocation.lat,
        lng: userLocation.lng,
        accuracy: 15,
        heading: null,
        speed: null,
        timestamp: Date.now(),
      }
    : null;

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full z-0"
    >
      <OfflineCachedTileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LiveTracker location={liveLoc} />
      <FollowController userLocation={userLocation} follow={followUser} />
      <RouteLayer route={route} fitBounds={false} />

      {destination && !route && (
        <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
          <Popup>{destinationTitle ?? 'Destination'}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}