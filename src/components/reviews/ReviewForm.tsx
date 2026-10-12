// src/components/reviews/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReviewStore, type Review } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import StarRating from './StarRating';

interface ReviewFormProps {
  listingId: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ listingId, onSubmitted, onCancel }: ReviewFormProps) {
  const user = useAuthStore((s) => s.user);
  const addReview = useReviewStore((s) => s.addReview);
  const bookings = useBookingStore((s) => s.bookings);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasStayed = bookings.some(
    (b) =>
      b.listingId === listingId &&
      (b.status === 'PAID' || b.status === 'COMPLETED' || b.status === 'CHECKED_IN')
  );

  const canSubmit = rating > 0 && comment.trim().length >= 10 && !!user;

  const handleSubmit = async () => {
    if (!canSubmit || !user) {
      toast.error('Please add a rating and a comment (min 10 chars)');
      return;
    }

    setSubmitting(true);
    await sleep(400);

    const review: Review = {
      id: `rv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      listingId,
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatarUrl,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedStay: hasStayed,
      helpful: 0,
    };

    addReview(review);
    toast.success('Thank you for your review!');
    setRating(0);
    setComment('');
    setSubmitting(false);
    onSubmitted?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Write a review</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10"
            aria-label="Cancel"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Star input */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Comment */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your experience
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share what you liked, what could be improved, and any tips for future guests..."
          className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 resize-none text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 · min 10 characters
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Posting...' : 'Post review'}
      </button>
    </motion.div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}