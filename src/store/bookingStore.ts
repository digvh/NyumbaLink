// src/store/bookingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPhoto?: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;      // ISO date
  checkOut: string;     // ISO date
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  currency: 'TZS' | 'USD';
  status: BookingStatus;
  paymentMethod?: 'MPESA' | 'TIGOPESA' | 'AIRTELMONEY' | 'CASH';
  paymentReference?: string;
  createdAt: string;
  notes?: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
      updateBooking: (id, patch) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      cancelBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'CANCELLED' as BookingStatus } : b
          ),
        })),
      getBooking: (id) => get().bookings.find((b) => b.id === id),
    }),
    { name: 'nyumbalink-bookings' }
  )
);