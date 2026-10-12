// src/components/map/LiveTracker.tsx
'use client';

import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { LiveLocation } from '@/hooks/useLiveLocation';

interface LiveTrackerProps {
  location: LiveLocation | null;
  accuracyCircle?: boolean;
}

function userIcon(heading: number | null) {
  const arrow = heading != null
    ? `<div style="
        width: 0; height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #3b82f6;
        margin-top: -12px;
      "></div>`
    : '';
  return L.divIcon({
    className: '',
    html: `
      ${arrow}
      <div style="
        width: 18px; height: 18px;
        border-radius: 9999px;
        background: #3b82f6;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 8px rgba(59,130,246,0.25);
      "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function LiveTracker({ location, accuracyCircle = true }: LiveTrackerProps) {
  if (!location) return null;

  return (
    <>
      {accuracyCircle && (
        <Circle
          center={[location.lat, location.lng]}
          radius={Math.max(10, location.accuracy)}
          pathOptions={{
            color: '#3b82f6',
            weight: 1,
            fillOpacity: 0.1,
          }}
        />
      )}
      <Marker position={[location.lat, location.lng]} icon={userIcon(location.heading)}>
        <Popup>
          <div className="text-xs">
            <p className="font-semibold">You are here</p>
            <p className="text-gray-500">Accuracy: ±{Math.round(location.accuracy)} m</p>
          </div>
        </Popup>
      </Marker>
    </>
  );
}