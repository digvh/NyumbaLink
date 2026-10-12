// src/lib/routing.ts
import { t, tModifier, tCompass, tDistance } from '@/lib/voice-phrases';
import type { VoiceLang } from '@/lib/voice';

export interface RouteStep {
  instruction: string;
  instructionSw: string;
  distance: number;
  duration: number;
  name: string;
  maneuver: {
    type: string;
    modifier?: string;
    bearing_after?: number;
    location: [number, number];
  };
}

export interface Route {
  distance: number;
  duration: number;
  geometry: [number, number][];
  steps: RouteStep[];
}

export type TravelMode = 'driving' | 'walking' | 'cycling';

export interface RouteRequest {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  mode?: TravelMode;
}

const OSRM_BASE = 'https://router.project-osrm.org';

export async function getRoute({
  from,
  to,
  mode = 'driving',
}: RouteRequest): Promise<Route> {
  const url =
    `${OSRM_BASE}/route/v1/${mode}/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?overview=full&geometries=geojson&steps=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM request failed: ${res.status}`);

  const data = await res.json();
  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found');
  }

  const route = data.routes[0];
  const leg = route.legs[0];

  const geometry: [number, number][] = route.geometry.coordinates.map(
    (c: [number, number]) => [c[1], c[0]]
  );

  const steps: RouteStep[] = (leg.steps || []).map((s: any) => ({
    instruction: buildInstruction(s, 'en'),
    instructionSw: buildInstruction(s, 'sw'),
    distance: s.distance,
    duration: s.duration,
    name: s.name || '',
    maneuver: {
      type: s.maneuver.type,
      modifier: s.maneuver.modifier,
      bearing_after: s.maneuver.bearing_after,
      location: [s.maneuver.location[1], s.maneuver.location[0]],
    },
  }));

  return {
    distance: route.distance,
    duration: route.duration,
    geometry,
    steps,
  };
}

function buildInstruction(step: any, lang: VoiceLang): string {
  const { type, modifier } = step.maneuver;
  const road = step.name ? ` ${t('onto', lang)} ${step.name}` : '';
  const dist = step.distance > 10 ? ` ${t('for', lang)} ${tDistance(step.distance, lang)}` : '';

  if (type === 'depart') {
    const dir = tCompass(bearingToCompass(step.maneuver.bearing_after), lang);
    return `${t('head', lang)} ${dir}${road}${dist}`;
  }
  if (type === 'arrive') {
    return t('arrived', lang);
  }
  if (type === 'turn') {
    return `${t('turn', lang)} ${tModifier(modifier, lang)}${road}${dist}`;
  }
  if (type === 'continue') {
    return `${t('continue', lang)} ${tModifier(modifier, lang)}${road}${dist}`;
  }
  if (type === 'merge') {
    return `${t('merge', lang)} ${tModifier(modifier, lang)}${road}${dist}`;
  }
  if (type === 'fork') {
    return `${t('keep', lang)} ${tModifier(modifier, lang)}${road}${dist}`;
  }
  if (type === 'roundabout' || type === 'rotary') {
    return `${t('roundabout', lang)}${road}${dist}`;
  }
  if (type === 'new name') {
    return `${t('newName', lang)}${road}${dist}`;
  }
  if (type === 'end of road') {
    return `${t('endOfRoad', lang)} ${tModifier(modifier, lang)}${road}${dist}`;
  }
  return `${t('continue', lang)}${road}${dist}`;
}

function bearingToCompass(bearing?: number): string {
  if (bearing == null) return '';
  const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  return dirs[Math.round(bearing / 45) % 8];
}

export function formatMeters(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `${hours} hr` : `${hours} hr ${rem} min`;
}