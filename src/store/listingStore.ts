// src/store/listingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Listing } from '@/types/listing';

interface ListingState {
  myListings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListing: (id: string) => Listing | undefined;
  setStatus: (id: string, status: Listing['status']) => void;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set, get) => ({
      myListings: [],
      addListing: (listing) =>
        set((s) => ({ myListings: [listing, ...s.myListings] })),
      updateListing: (id, patch) =>
        set((s) => ({
          myListings: s.myListings.map((l) =>
            l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l
          ),
        })),
      deleteListing: (id) =>
        set((s) => ({ myListings: s.myListings.filter((l) => l.id !== id) })),
      getListing: (id) => get().myListings.find((l) => l.id === id),
      setStatus: (id, status) =>
        set((s) => ({
          myListings: s.myListings.map((l) =>
            l.id === id
              ? { ...l, status, updatedAt: new Date().toISOString() }
              : l
          ),
        })),
    }),
    { name: 'nyumbalink-my-listings' }
  )
);