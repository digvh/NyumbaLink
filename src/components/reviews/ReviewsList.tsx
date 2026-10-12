// src/components/reviews/ReviewsList.tsx
'use client';

import { useState } from 'react';
import { Star, PenSquare } from 'lucide-react';
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { getRatingBreakdown } from '@/lib/reviews';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';

interface ReviewsListProps {
  listingId: string;
  /** Owner mode: allow replies */
  isOwner?: boolean;
}

export default function ReviewsList({ listingId, isOwner = false }: ReviewsListProps) {
  const { reviews } = useReviewStore();
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);

  const listingReviews = reviews.filter((r) => r.listingId === listingId);
  const breakdown = getRatingBreakdown(listingReviews);

  const userAlreadyReviewed = user
    ? listingReviews.some((r) => r.userId === user.id)
    : false;

  return (
    <div className="space-y-5">
      {/* Header + Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average */}
        <div className="text-center p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/30 dark:border-white/10">
          <p className="text-5xl font-bold gradient-text">
            {breakdown.average > 0 ? breakdown.average.toFixed(1) : '—'}
          </p>
          <div className="mt-2 flex justify-center">
            <StarRating value={breakdown.average} size="md" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {breakdown.total} review{breakdown.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Bars */}
        <div className="md:col-span-2 space-y-1.5">
          {breakdown.counts.map((c) => {
            const pct = breakdown.total > 0 ? (c.count / breakdown.total) * 100 : 0;
            return (
              <div key={c.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  {c.stars} <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500 dark:text-gray-400">
                  {c.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review button */}
      {!isOwner && user && !userAlreadyReviewed && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition inline-flex items-center justify-center gap-2"
        >
          <PenSquare className="w-4 h-4" />
          Write a review
        </button>
      )}

      {!isOwner && !user && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </a>{' '}
          to write a review
        </p>
      )}

      {userAlreadyReviewed && !isOwner && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ✓ You have already reviewed this property
        </p>
      )}

      {/* Form */}
      {showForm && (
        <ReviewForm
          listingId={listingId}
          onSubmitted={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews */}
      {listingReviews.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {listingReviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              canReply={isOwner}
              canDelete={user?.id === r.userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}