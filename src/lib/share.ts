// src/lib/share.ts
import { formatDuration, formatMeters, Route } from '@/lib/routing';

interface ShareETAArgs {
  route: Route;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
}

/**
 * Generates an ETA message and shares it via Web Share API
 * (falls back to WhatsApp, then to copy-to-clipboard).
 */
export async function shareETA({
  route,
  destinationName,
  destinationLat,
  destinationLng,
}: ShareETAArgs): Promise<'share' | 'whatsapp' | 'clipboard' | 'cancelled'> {
  const now = new Date();
  const arrival = new Date(now.getTime() + route.duration * 1000);
  const arrivalStr = arrival.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;

  const message =
    `🚗 I'm on my way to ${destinationName}\n` +
    `📍 Distance: ${formatMeters(route.distance)}\n` +
    `⏱️ ETA: ${arrivalStr} (~${formatDuration(route.duration)})\n` +
    `🗺️ Track: ${mapsUrl}`;

  // 1. Try native share (works on mobile)
  if (typeof navigator !== 'undefined' && (navigator as any).share) {
    try {
      await (navigator as any).share({
        title: `On my way to ${destinationName}`,
        text: message,
        url: mapsUrl,
      });
      return 'share';
    } catch (err: any) {
      if (err?.name === 'AbortError') return 'cancelled';
      // else fall through
    }
  }

  // 2. Fallback to WhatsApp Web
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  if (typeof window !== 'undefined') {
    const opened = window.open(waUrl, '_blank');
    if (opened) return 'whatsapp';
  }

  // 3. Fallback to clipboard
  try {
    await navigator.clipboard.writeText(message);
    return 'clipboard';
  } catch {
    return 'cancelled';
  }
}