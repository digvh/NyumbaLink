// src/store/reviewStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  createdAt: string;
  verifiedStay: boolean;
  helpful: number;
  ownerReply?: {
    text: string;
    createdAt: string;
  };
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  addReply: (id: string, text: string) => void;
  markHelpful: (id: string) => void;
  getByListing: (listingId: string) => Review[];
  getAverageRating: (listingId: string) => number;
  getCount: (listingId: string) => number;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      addReview: (r) => set((s) => ({ reviews: [r, ...s.reviews] })),
      deleteReview: (id) =>
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),
      addReply: (id, text) =>
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ownerReply: { text, createdAt: new Date().toISOString() },
                }
              : r
          ),
        })),
      markHelpful: (id) =>
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === id ? { ...r, helpful: r.helpful + 1 } : r
          ),
        })),
      getByListing: (listingId) =>
        get().reviews.filter((r) => r.listingId === listingId),
      getAverageRating: (listingId) => {
        const list = get().reviews.filter((r) => r.listingId === listingId);
        if (list.length === 0) return 0;
        return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
      },
      getCount: (listingId) =>
        get().reviews.filter((r) => r.listingId === listingId).length,
    }),
    { name: 'nyumbalink-reviews' }
  )
);
