// src/app/notifications/page.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Bell, Check, Trash2, Calendar, Star, CheckCircle2,
  XCircle, MessageSquare, CreditCard, Info,
} from 'lucide-react';
import { useNotificationStore, type NotificationType } from '@/store/notificationStore';
import { formatRelativeTime } from '@/lib/reviews';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/utils/helpers';

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

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, delete: del, clearAll } =
    useNotificationStore();

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="min-h-screen relative overflow-hidden py-10">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-3"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {notifications.length > 0
                ? `${notifications.length} total · ${notifications.filter((n) => !n.read).length} unread`
                : 'Stay updated with your bookings and messages'}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {hasUnread && (
                <button
                  onClick={markAllRead}
                  className="px-4 py-2 rounded-2xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-2xl text-sm font-semibold text-red-500 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {notifications.length === 0 ? (
          <GlassCard padding="lg" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Bell className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              No notifications yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You'll see updates about your bookings, messages, and reviews here.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
            >
              Browse properties
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, index) => {
              const Icon = ICONS[n.type];
              const colorClass = ICON_COLORS[n.type];
              const content = (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border transition',
                    n.read
                      ? 'bg-white/60 dark:bg-gray-900/60 border-white/30 dark:border-white/10'
                      : 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900'
                  )}
                >
                  <div
                    className={cn(
                      'w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0',
                      colorClass
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">
                          {n.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                          {n.body}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          {formatRelativeTime(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markRead(n.id);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-800"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        del(n.id);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </motion.div>
              );

              if (n.link) {
                return (
                  <Link key={n.id} href={n.link} onClick={() => markRead(n.id)}>
                    {content}
                  </Link>
                );
              }
              return (
                <div key={n.id} onClick={() => markRead(n.id)}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}