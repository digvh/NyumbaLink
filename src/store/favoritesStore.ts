// src/store/favoritesStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id) => {
        const { favoriteIds } = get();
        if (favoriteIds.includes(id)) {
          set({ favoriteIds: favoriteIds.filter((f) => f !== id) });
        } else {
          set({ favoriteIds: [...favoriteIds, id] });
        }
      },

      addFavorite: (id) => {
        const { favoriteIds } = get();
        if (!favoriteIds.includes(id)) {
          set({ favoriteIds: [...favoriteIds, id] });
        }
      },

      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((f) => f !== id),
        })),

      clearFavorites: () => set({ favoriteIds: [] }),

      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'nyumbalink-favorites',
    }
  )
);
