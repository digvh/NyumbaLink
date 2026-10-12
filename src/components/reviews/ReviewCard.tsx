// src/components/reviews/ReviewCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, BadgeCheck, MessageSquare, ChevronDown, Trash2 } from 'lucide-react';
import type { Review } from '@/store/reviewStore';
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { formatRelativeTime, getInitials, avatarColor } from '@/lib/reviews';
import StarRating from './StarRating';
import { cn } from '@/utils/helpers';

interface ReviewCardProps {
  review: Review;
  /** If provided, this user can reply (owner) */
  canReply?: boolean;
  /** If provided, this user can delete */
  canDelete?: boolean;
}

export default function ReviewCard({ review, canReply, canDelete }: ReviewCardProps) {
  const { markHelpful, addReply, deleteReview } = useReviewStore();
  const user = useAuthStore((s) => s.user);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const truncated = review.comment.length > 220 && !expanded;

  const handleHelpful = () => {
    markHelpful(review.id);
  };

  const handleSubmitReply = () => {
    if (replyText.trim().length < 3) return;
    addReply(review.id, replyText.trim());
    setReplyText('');
    setShowReplyForm(false);
  };

  const handleDelete = () => {
    if (typeof window !== 'undefined' && window.confirm('Delete this review?')) {
      deleteReview(review.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 bg-gradient-to-br',
            avatarColor(review.userName)
          )}
        >
          {getInitials(review.userName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-white truncate">
              {review.userName}
            </span>
            {review.verifiedStay && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                <BadgeCheck className="w-3 h-3" />
                Verified stay
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating value={review.rating} size="sm" />
            <span className="text-xs text-gray-500">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500 transition"
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-3">
        {truncated ? review.comment.slice(0, 220) + '...' : review.comment}
      </p>
      {review.comment.length > 220 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 mb-3"
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronDown
            className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')}
          />
        </button>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {review.photos.slice(0, 5).map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={p}
              alt={`Review photo ${i + 1}`}
              className="w-20 h-20 object-cover rounded-xl shrink-0 border border-white/30 dark:border-white/10"
            />
          ))}
        </div>
      )}

      {/* Owner reply */}
      {review.ownerReply && (
        <div className="ml-6 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700 mb-3">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            Owner replied · {formatRelativeTime(review.ownerReply.createdAt)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {review.ownerReply.text}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/20 dark:border-white/10">
        <button
          onClick={handleHelpful}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful {review.helpful > 0 && `(${review.helpful})`}
        </button>
        {canReply && !review.ownerReply && (
          <button
            onClick={() => setShowReplyForm((s) => !s)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Reply
          </button>
        )}
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-3 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Write your reply..."
            className="w-full px-3 py-2 text-sm rounded-xl bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-indigo-400 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={replyText.trim().length < 3}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 disabled:opacity-40"
            >
              Post reply
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}