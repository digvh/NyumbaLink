// src/app/bookings/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Calendar, MapPin, Users, Building2, Clock,
  X, AlertTriangle, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useBookingStore, type Booking, type BookingStatus } from '@/store/bookingStore';
import { formatPrice } from '@/utils/helpers';
import { formatDate, getStatusLabel, getStatusColor } from '@/lib/booking';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';

type Filter = 'all' | 'upcoming' | 'completed' | 'cancelled';

export default function BookingsPage() {
  const { bookings, cancelBooking } = useBookingStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [confirmCancel, setConfirmCancel] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming')
      return b.status === 'CONFIRMED' || b.status === 'PAID' || b.status === 'PENDING' || b.status === 'CHECKED_IN';
    if (filter === 'completed') return b.status === 'COMPLETED';
    if (filter === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  const handleCancel = (b: Booking) => {
    cancelBooking(b.id);
    toast.success('Booking cancelled');
    setConfirmCancel(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-10">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage all your reservations
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['all', 'upcoming', 'completed', 'cancelled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition whitespace-nowrap ${
                filter === f
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 border border-white/30 dark:border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <GlassCard padding="lg" className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              No bookings yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse properties and make your first booking
            </p>
            <Link href="/search">
              <GlassButton variant="gradient" icon={<Search className="w-4 h-4" />}>
                Find a place
              </GlassButton>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filtered.map((b, index) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard padding="md" className="hover:shadow-xl transition">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20">
                      {b.listingPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.listingPhoto}
                          alt={b.listingTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-indigo-400/70" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          {b.listingTitle}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${getStatusColor(
                            b.status
                          )}`}
                        >
                          {getStatusLabel(b.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(b.checkIn)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {b.nights} night{b.nights > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {b.guests} guest{b.guests > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          Ref: {b.id}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/20 dark:border-white/10">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {formatPrice(b.totalPrice, b.currency)}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/listing/${b.listingId}`}>
                            <button className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                              View
                            </button>
                          </Link>
                          {(b.status === 'PENDING' ||
                            b.status === 'CONFIRMED' ||
                            b.status === 'PAID') && (
                            <button
                              onClick={() => setConfirmCancel(b)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirm dialog */}
      {confirmCancel && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={() => setConfirmCancel(null)}
          />
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pointer-events-auto w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-1">
                Cancel this booking?
              </h3>
              <p className="text-sm text-center text-gray-500 mb-5">
                {confirmCancel.listingTitle} — {formatDate(confirmCancel.checkIn)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmCancel(null)}
                  className="flex-1 py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                >
                  Keep
                </button>
                <button
                  onClick={() => handleCancel(confirmCancel)}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 shadow-lg"
                >
                  Yes, cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}