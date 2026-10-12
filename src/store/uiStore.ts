// src/store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isSearchModalOpen: boolean;
  isBottomSheetOpen: boolean;
  selectedListingId: string | null;

  toggleSidebar: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  toggleBottomSheet: () => void;
  setSelectedListing: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSearchModalOpen: false,
  isBottomSheetOpen: true,
  selectedListingId: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  toggleBottomSheet: () => set((state) => ({ isBottomSheetOpen: !state.isBottomSheetOpen })),
  setSelectedListing: (id) => set({ selectedListingId: id }),
}));