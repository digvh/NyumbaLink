// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home, PlusCircle, Heart, MessageSquare, Settings, LogOut,
  Eye, Star, Trash2, Pause, Play, Edit3, Calendar, DollarSign,
  TrendingUp, Users, Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useListingStore } from '@/store/listingStore';
import { useBookingStore } from '@/store/bookingStore';
import { useReviewStore } from '@/store/reviewStore';
import { formatPrice, getCategoryLabel } from '@/utils/helpers';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/booking';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';

type Tab = 'overview' | 'listings' | 'bookings' | 'reviews' | 'settings';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { myListings, deleteListing, setStatus } = useListingStore();
  const { bookings } = useBookingStore();
  const { reviews } = useReviewStore();
  const [tab, setTab] = useState<Tab>('overview');

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Stats
  const myListingIds = new Set(myListings.map((l) => l.id));
  const myBookings = bookings.filter((b) => myListingIds.has(b.listingId));
  const myReviews = reviews.filter((r) => myListingIds.has(r.listingId));
  const totalEarnings = myBookings
    .filter((b) => b.status === 'PAID' || b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const totalViews = myListings.reduce((sum, l) => sum + (l.viewsCount ?? 0), 0);

  const tabs: { id: Tab; label: string; icon: typeof Home; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'listings', label: 'My Listings', icon: Building2, count: myListings.length },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: myBookings.length },
    { id: 'reviews', label: 'Reviews', icon: Star, count: myReviews.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Delete this listing?')) {
      deleteListing(id);
      toast.success('Listing deleted');
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const next = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStatus(id, next as any);
    toast.success(next === 'ACTIVE' ? 'Listing activated' : 'Listing paused');
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.fullName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {user.phoneNumber}
                  {user.verificationStatus === 'VERIFIED' && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      ✓ Verified
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/list-property">
                <GlassButton variant="gradient" icon={<PlusCircle className="w-4 h-4" />}>
                  Add Listing
                </GlassButton>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 border border-white/30 dark:border-white/10 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {typeof t.count === 'number' && t.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active ? 'bg-white/25' : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Building2}
              label="Listings"
              value={myListings.length}
              gradient="from-indigo-500 to-purple-500"
              delay={0}
            />
            <StatCard
              icon={Eye}
              label="Total Views"
              value={totalViews}
              gradient="from-blue-500 to-cyan-500"
              delay={0.1}
            />
            <StatCard
              icon={Calendar}
              label="Bookings"
              value={myBookings.length}
              gradient="from-emerald-500 to-teal-500"
              delay={0.2}
            />
            <StatCard
              icon={DollarSign}
              label="Earnings"
              value={formatPrice(totalEarnings, 'TZS')}
              gradient="from-amber-500 to-orange-500"
              delay={0.3}
              small
            />
          </div>
        )}

        {/* LISTINGS */}
        {tab === 'listings' && (
          <div className="space-y-4">
            {myListings.length === 0 ? (
              <GlassCard padding="lg" className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  No listings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  List your first property to start earning
                </p>
                <Link href="/list-property">
                  <GlassButton variant="gradient" icon={<PlusCircle className="w-4 h-4" />}>
                    Add Listing
                  </GlassButton>
                </Link>
              </GlassCard>
            ) : (
              myListings.map((l) => (
                <GlassCard key={l.id} padding="md">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      {l.primaryPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={l.primaryPhoto}
                          alt={l.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">
                            {l.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {getCategoryLabel(l.category)} · {l.district}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            l.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold gradient-text mb-2">
                        {formatPrice(l.priceTzs, 'TZS')}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {l.viewsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" /> {l.averageRating?.toFixed(1) ?? '—'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(l.id, l.status)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition inline-flex items-center gap-1"
                        >
                          {l.status === 'ACTIVE' ? (
                            <>
                              <Pause className="w-3 h-3" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" /> Activate
                            </>
                          )}
                        </button>
                        <Link href={`/listing/${l.id}`}>
                          <button className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition inline-flex items-center gap-1">
                            <Edit3 className="w-3 h-3" /> View
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 transition inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {myBookings.length === 0 ? (
              <GlassCard padding="lg" className="text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No bookings received yet
                </p>
              </GlassCard>
            ) : (
              myBookings.map((b) => (
                <GlassCard key={b.id} padding="md">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {b.listingTitle}
                      </h3>
                      <p className="text-xs text-gray-500">Ref: {b.id}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${getStatusColor(b.status)}`}
                    >
                      {getStatusLabel(b.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <span>📅 {formatDate(b.checkIn)}</span>
                    <span>👤 {b.guestName}</span>
                    <span>📞 {b.guestPhone}</span>
                    <span>🌙 {b.nights} nights</span>
                  </div>
                  <div className="pt-3 border-t border-white/20 dark:border-white/10 flex items-center justify-between">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(b.totalPrice, b.currency)}
                    </span>
                    <a
                      href={`tel:${b.guestPhone}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition"
                    >
                      Call guest
                    </a>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && (
          <div className="space-y-3">
            {myReviews.length === 0 ? (
              <GlassCard padding="lg" className="text-center">
                <div className="text-6xl mb-4">⭐</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No reviews received yet
                </p>
              </GlassCard>
            ) : (
              myReviews.map((r) => (
                <GlassCard key={r.id} padding="md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {r.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {r.userName}
                        </span>
                        <span className="text-yellow-500 text-xs">
                          {'★'.repeat(r.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {r.comment}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <GlassCard padding="lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Account Settings
            </h2>
            <div className="space-y-3">
              <SettingRow label="Name" value={user.fullName} />
              <SettingRow label="Phone" value={user.phoneNumber} />
              <SettingRow label="Email" value={user.email ?? 'Not set'} />
              <SettingRow label="Role" value={user.role} />
              <SettingRow
                label="Verification"
                value={
                  user.verificationStatus === 'VERIFIED'
                    ? '✓ Verified'
                    : user.verificationStatus
                }
              />
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  delay = 0,
  small = false,
}: {
  icon: typeof Home;
  label: string;
  value: string | number;
  gradient: string;
  delay?: number;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg p-4"
    >
      <div
        className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`font-bold text-gray-900 dark:text-white ${small ? 'text-base' : 'text-2xl'} mt-0.5`}>
        {value}
      </p>
    </motion.div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}