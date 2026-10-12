// src/utils/helpers.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: 'TZS' | 'USD' = 'TZS'): string {
  if (currency === 'USD') {
    const usdPrice = price * 0.0004;
    return `$${usdPrice.toFixed(2)}`;
  }
  return `TZS ${price.toLocaleString('en-TZ')}`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    HOTEL: 'Hotel',
    LODGE: 'Lodge',
    SELF_CONTAINED_ROOM: 'Self-Contained Room',
    RESTAURANT: 'Restaurant',
    BAR: 'Bar',
    LAND: 'Land for Sale',
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    HOTEL: 'bg-blue-100 text-blue-800',
    LODGE: 'bg-green-100 text-green-800',
    SELF_CONTAINED_ROOM: 'bg-purple-100 text-purple-800',
    RESTAURANT: 'bg-orange-100 text-orange-800',
    BAR: 'bg-pink-100 text-pink-800',
    LAND: 'bg-amber-100 text-amber-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getViewTypeLabel(viewType: string): string {
  const labels: Record<string, string> = {
    SEA: 'Sea View',
    MOUNTAIN: 'Mountain View',
    CITY: 'City View',
    GARDEN: 'Garden View',
    STREET: 'Street View',
    NONE: 'No Special View',
  };
  return labels[viewType] || viewType;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}