// src/components/notification/NotificationPanel.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell, Check, Trash2, Calendar, Star, CheckCircle2,
  XCircle, MessageSquare, CreditCard, Info,
} from 'lucide-react';
import { useNotificationStore, type NotificationType } from '@/store/notificationStore';
import { formatRelativeTime } from '@/lib/reviews';
import { cn } from '@/utils/helpers';

interface NotificationPanelProps {
  onClose: () => void;
}

const ICONS: Record<NotificationType, typeof Bell> = {
  BOOKING_NEW: Calendar,
  BOOKING_CONFIRMED: CheckCircle2,
  BOOKING_CANCELLED: XCircle,
  PAYMENT_SUCCESS: CreditCard,
  REVIEW_NEW: Star,
  LISTING_APPROVED: CheckCircle2,
  LISTING_REJECTED: XCircle,
  MESSAGE_NEW: MessageSquare,
  SYSTEM: Info,
};

const ICON_COLORS: Record<NotificationType, string> = {
  BOOKING_NEW: 'from-blue-500 to-cyan-500',
  BOOKING_CONFIRMED: 'from-emerald-500 to-teal-500',
  BOOKING_CANCELLED: 'from-red-500 to-rose-500',
  PAYMENT_SUCCESS: 'from-emerald-500 to-green-500',
  REVIEW_NEW: 'from-amber-500 to-orange-500',
  LISTING_APPROVED: 'from-emerald-500 to-teal-500',
  LISTING_REJECTED: 'from-red-500 to-rose-500',
  MESSAGE_NEW: 'from-indigo-500 to-purple-500',
  SYSTEM: 'from-gray-500 to-gray-600',
};

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markRead, markAllRead, delete: del, clearAll } = useNotificationStore();

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div className="flex items-center gap-1">
          {hasUnread && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bell className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">No notifications</p>
            <p className="text-xs text-gray-500 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <ul>
            {notifications.map((n) => {
              const Icon = ICONS[n.type];
              const colorClass = ICON_COLORS[n.type];
              const inner = (
                <div
                  className={cn(
                    'flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 transition',
                    !n.read && 'bg-indigo-50/50 dark:bg-indigo-950/20'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
                      colorClass
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markRead(n.id);
                        }}
                        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/80 dark:hover:bg-gray-800"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        del(n.id);
                      }}
                      className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );

              if (n.link) {
                return (
                  <li key={n.id}>
                    <Link
                      href={n.link}
                      onClick={() => {
                        markRead(n.id);
                        onClose();
                      }}
                    >
                      {inner}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={n.id} onClick={() => markRead(n.id)}>
                  {inner}
                </li>
              );
            })}
          </ul>
        )}
      </div>
            {/* Footer */}
      <div className="p-3 border-t border-white/20 dark:border-white/10">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block w-full text-center py-2.5 rounded-2xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
        >
          View all notifications
        </Link>
      </div>
    
    </motion.div>
  );
}