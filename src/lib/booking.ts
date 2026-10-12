// src/lib/booking.ts
import type { Booking } from '@/store/bookingStore';

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function calculateTotal(nights: number, pricePerNight: number): number {
  return nights * pricePerNight;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Check if two date ranges overlap. Ranges are inclusive of checkIn, exclusive of checkOut. */
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Given a check-in and check-out date, checks against existing bookings
 * and returns the first conflict if any.
 */
export function findConflict(
  checkIn: Date,
  checkOut: Date,
  bookings: Booking[],
  listingId: string
): Booking | null {
  for (const b of bookings) {
    if (b.listingId !== listingId) continue;
    if (b.status === 'CANCELLED' || b.status === 'COMPLETED') continue;
    const bStart = new Date(b.checkIn);
    const bEnd = new Date(b.checkOut);
    if (rangesOverlap(checkIn, checkOut, bStart, bEnd)) {
      return b;
    }
  }
  return null;
}

/**
 * Given a listing ID and bookings, returns the set of dates (YYYY-MM-DD)
 * that are already booked.
 */
export function getBookedDates(
  bookings: Booking[],
  listingId: string
): Set<string> {
  const set = new Set<string>();
  for (const b of bookings) {
    if (b.listingId !== listingId) continue;
    if (b.status === 'CANCELLED' || b.status === 'COMPLETED') continue;
    const start = new Date(b.checkIn);
    const end = new Date(b.checkOut);
    const cursor = new Date(start);
    while (cursor < end) {
      set.add(toDateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return set;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function generateBookingRef(): string {
  const now = new Date();
  const ymd =
    now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `NYL-${ymd}-${rand}`;
}

export function getStatusLabel(status: Booking['status']): string {
  const labels: Record<Booking['status'], string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PAID: 'Paid',
    CHECKED_IN: 'Checked in',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return labels[status];
}

export function getStatusColor(status: Booking['status']): string {
  const colors: Record<Booking['status'], string> = {
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    PAID: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    CHECKED_IN: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };
  return colors[status];
}