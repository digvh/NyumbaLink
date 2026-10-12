// src/store/searchStore.ts
import { create } from 'zustand';
import { ListingCategory } from '@/types/listing';

interface SearchState {
  location: { lat: number; lng: number } | null;
  radius: number;
  maxPrice: number;
  minPrice: number;
  category: ListingCategory | null;
  currency: 'TZS' | 'USD';
  sortBy: 'distance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';

  setLocation: (location: { lat: number; lng: number }) => void;
  setRadius: (radius: number) => void;
  setMaxPrice: (price: number) => void;
  setMinPrice: (price: number) => void;
  setCategory: (category: ListingCategory | null) => void;
  setSortBy: (sort: 'distance' | 'price_asc' | 'price_desc' | 'newest' | 'rating') => void;
  toggleCurrency: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  location: null,
  radius: 5000,
  maxPrice: 10000000,
  minPrice: 0,
  category: null,
  currency: 'TZS',
  sortBy: 'distance',

  setLocation: (location) => set({ location }),
  setRadius: (radius) => set({ radius }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleCurrency: () =>
    set((state) => ({
      currency: state.currency === 'TZS' ? 'USD' : 'TZS',
    })),
}));