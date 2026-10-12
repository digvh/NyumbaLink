// src/store/notificationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType =
  | 'BOOKING_NEW'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_SUCCESS'
  | 'REVIEW_NEW'
  | 'LISTING_APPROVED'
  | 'LISTING_REJECTED'
  | 'MESSAGE_NEW'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  add: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  delete: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      add: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...s.notifications,
          ].slice(0, 100),
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((x) =>
            x.id === id ? { ...x, read: true } : x
          ),
        })),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((x) => ({ ...x, read: true })),
        })),
      delete: (id) =>
        set((s) => ({
          notifications: s.notifications.filter((x) => x.id !== id),
        })),
      clearAll: () => set({ notifications: [] }),
      unreadCount: () => get().notifications.filter((x) => !x.read).length,
    }),
    { name: 'nyumbalink-notifications' }
  )
);