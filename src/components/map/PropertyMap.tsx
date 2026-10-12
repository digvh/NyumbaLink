// src/components/map/PropertyMap.tsx
'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import OfflineCachedTileLayer from './OfflineCachedTileLayer';
import 'leaflet/dist/leaflet.css';
import type { Listing } from '@/types/listing';
import { formatPrice } from '@/utils/helpers';


interface PropertyMapProps {
  listings: Listing[];
  selectedListing: string | null;
  onSelectListing: (id: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
}

const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083]; // Dar es Salaam

function createMarkerIcon(selected: boolean) {
  const color = selected ? '#f43f5e' : '#6366f1';
  const size = selected ? 20 : 16;
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      border-radius: 9999px;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 14px; height: 14px;
      border-radius: 9999px;
      background: #3b82f6;
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 6px rgba(59,130,246,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

// Keeps the map centered / flying to the relevant location on updates
function MapController({
  userLocation,
  selectedListing,
  listings,
}: {
  userLocation: PropertyMapProps['userLocation'];
  selectedListing: string | null;
  listings: Listing[];
}) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13), {
        duration: 1,
      });
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (!selectedListing) return;
    const listing = listings.find((l) => l.id === selectedListing);
    if (listing?.latitude != null && listing?.longitude != null) {
      map.flyTo([listing.latitude, listing.longitude], Math.max(map.getZoom(), 15), {
        duration: 1,
      });
    }
  }, [selectedListing, listings, map]);

  return null;
}

export default function PropertyMap({
  listings,
  selectedListing,
  onSelectListing,
  userLocation,
}: PropertyMapProps) {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full z-0"
    >
            <OfflineCachedTileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        userLocation={userLocation}
        selectedListing={selectedListing}
        listings={listings}
      />

      {/* User location marker */}
      {userLocation && (
        <>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={200}
            pathOptions={{ color: '#3b82f6', weight: 1, fillOpacity: 0.08 }}
          />
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          >
            <Popup>
              <span className="text-sm font-semibold">You are here</span>
            </Popup>
          </Marker>
        </>
      )}

      {/* Listing markers */}
      {listings.map((listing) => {
        if (listing.latitude == null || listing.longitude == null) return null;
        const selected = listing.id === selectedListing;
        return (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
            icon={createMarkerIcon(selected)}
            eventHandlers={{ click: () => onSelectListing(listing.id) }}
          >
                        <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-1">{listing.title}</h3>
                <p className="text-indigo-600 font-semibold mb-2">
                  {formatPrice(listing.priceTzs, 'TZS')}
                </p>
                <a
                  href={`/navigate?to=${listing.id}`}
                  className="block w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg py-1.5 hover:opacity-90 transition"
                >
                  Get Directions →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
