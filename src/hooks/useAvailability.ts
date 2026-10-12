// src/hooks/useAvailability.ts
'use client';

import { useMemo } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { getBookedDates, findConflict } from '@/lib/booking';

export function useAvailability(listingId: string) {
  const bookings = useBookingStore((s) => s.bookings);

  const bookedDates = useMemo(
    () => getBookedDates(bookings, listingId),
    [bookings, listingId]
  );

  const isAvailable = (checkIn: Date, checkOut: Date): boolean => {
    const conflict = findConflict(checkIn, checkOut, bookings, listingId);
    return conflict === null;
  };

  const getConflict = (checkIn: Date, checkOut: Date) =>
    findConflict(checkIn, checkOut, bookings, listingId);

  return { bookedDates, isAvailable, getConflict };
}