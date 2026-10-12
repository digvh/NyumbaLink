// src/app/listing/[id]/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin, Star, BadgeCheck, ArrowLeft, Phone, MessageCircle,
  Eye, Share2, Building2, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/api';
import { mockListings, findMockListing } from '@/data/mockListings';
import { formatPrice, formatDistance, getCategoryLabel, cn } from '@/utils/helpers';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import Loading from '@/components/ui/Loading';
import ListingCard from '@/components/listing/ListingCard';
import FavoriteButton from '@/components/listing/FavoriteButton';
import NavigateButton from '@/components/listing/NavigateButton';
import BookNowButton from '@/components/listing/BookNowButton';
import ReviewsList from '@/components/reviews/ReviewsList';
import ReportButton from '@/components/listing/ReportButton';
import type { Listing } from '@/types/listing';

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => <Loading text="Loading map..." />,
});

function priceSuffix(priceType: string) {
  if (priceType === 'PER_NIGHT') return ' / night';
  if (priceType === 'PER_MONTH') return ' / month';
  return '';
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const [activePhoto, setActivePhoto] = useState(0);

  const { data: listing, isLoading, error } = useQuery<Listing | undefined>({
    queryKey: ['listing', id],
    queryFn: async () => {
      try {
        const res = await apiService.getListing(id);
        const body = res.data;
        return (body?.data ?? body?.listing ?? body) as Listing;
      } catch {
        return findMockListing(id);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading property..." size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard padding="lg" className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Property not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This listing may have been removed.
          </p>
          <Link href="/search">
            <GlassButton variant="gradient" fullWidth>
              Back to Search
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const photos: string[] = [];
  if (listing.primaryPhoto) photos.push(listing.primaryPhoto);
  listing.photos?.forEach((p) => {
    if (!photos.includes(p.photoUrl)) photos.push(p.photoUrl);
  });
  const similar = mockListings
    .filter((l) => l.id !== listing.id && l.category === listing.category)
    .slice(0, 3);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      /* cancelled */
    }
  };

  const phone = listing.owner?.phoneNumber?.replace(/\s/g, '');
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(
        `Hi! I'm interested in "${listing.title}" on NyumbaLink.`
      )}`
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
                    <div className="flex items-center gap-2">
            <FavoriteButton listingId={listing.id} />
            <ReportButton listing={listing} variant="icon" />
            <button
              onClick={handleShare}
              aria-label="Share"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 border border-white/40 shadow-lg text-gray-500 hover:text-indigo-600"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard padding="sm" className="!p-3">
                <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-pink-500/20">
                  {photos.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photos[activePhoto] ?? photos[0]}
                      alt={listing.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-indigo-400/70" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-700">
                      {getCategoryLabel(listing.category)}
                    </span>
                    {listing.isVerified && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                {photos.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {photos.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={cn(
                          'w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition',
                          i === activePhoto ? 'border-indigo-500' : 'border-transparent opacity-70'
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            <GlassCard>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.address || `${listing.district}, ${listing.region}`}
                </span>
                {typeof listing.distanceMeters === 'number' && (
                  <span className="text-indigo-600 font-medium">
                    {formatDistance(listing.distanceMeters)} away
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {listing.viewsCount} views
                </span>
                {typeof listing.averageRating === 'number' && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {listing.averageRating.toFixed(1)} ({listing.reviewCount ?? 0} reviews)
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold gradient-text mb-4">
                {formatPrice(listing.priceTzs, 'TZS')}
                <span className="text-base font-medium text-gray-500">
                  {priceSuffix(listing.priceType)}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </GlassCard>

            {listing.amenities && Object.keys(listing.amenities).length > 0 && (
              <GlassCard>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(listing.amenities)
                    .filter(([, v]) => v)
                    .map(([k]) => (
                      <div
                        key={k}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/5 rounded-xl px-3 py-2"
                      >
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="capitalize">
                          {k.replace(/([A-Z])/g, ' $1')}
                        </span>
                      </div>
                    ))}
                </div>
              </GlassCard>
            )}

            {listing.latitude != null && listing.longitude != null && (
              <GlassCard>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Location
                </h2>
                <div className="h-64 rounded-2xl overflow-hidden">
                  <PropertyMap
                    listings={[listing]}
                    selectedListing={listing.id}
                    onSelectListing={() => {}}
                    userLocation={null}
                  />
                </div>
              </GlassCard>
            )}

                        <GlassCard>
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Reviews
              </h2>
              <ReviewsList listingId={listing.id} />
            </GlassCard>

          </div>

          {/* Right column */}
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Contact Owner
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {listing.owner?.fullName?.charAt(0) ?? 'O'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {listing.owner?.fullName ??
                      getCategoryLabel(listing.category) + ' Owner'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {listing.owner?.verificationStatus === 'VERIFIED'
                      ? 'Verified owner'
                      : 'Owner'}
                  </p>
                </div>
              </div>

              {/* ✅ FIXED: All action buttons in a single well-formed div */}
                            <div className="space-y-2">
                <BookNowButton listing={listing} />
                <NavigateButton listing={listing} />
                {phone && (
                  <a href={`tel:${phone}`} className="block">
                    <GlassButton variant="gradient" fullWidth icon={<Phone className="w-4 h-4" />}>
                      Call Owner
                    </GlassButton>
                  </a>
                )}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <GlassButton variant="glass" fullWidth icon={<MessageCircle className="w-4 h-4" />}>
                      WhatsApp
                    </GlassButton>
                  </a>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                Details
              </h2>
              <dl className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <dt>Category</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {getCategoryLabel(listing.category)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Region</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {listing.region}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>District</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {listing.district}
                  </dd>
                </div>
                {listing.floorLevel != null && (
                  <div className="flex justify-between">
                    <dt>Floor</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {listing.floorLevel}
                      {listing.totalFloors ? ` / ${listing.totalFloors}` : ''}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Elevator</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {listing.hasElevator ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>View</dt>
                  <dd className="font-medium text-gray-900 dark:text-white capitalize">
                    {listing.viewType.toLowerCase()}
                  </dd>
                </div>
              </dl>
            </GlassCard>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Similar properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}