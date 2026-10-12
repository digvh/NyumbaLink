// src/components/reviews/StarRating.tsx
'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/helpers';

interface StarRatingProps {
  /** Current rating (1-5) */
  value: number;
  /** If provided, renders as an interactive input */
  onChange?: (v: number) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show the numeric value next to stars */
  showValue?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

export default function StarRating({
  value,
  onChange,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !!onChange;
  const display = hover ?? value;

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = display >= n;
        const star = (
          <Star
            className={cn(
              SIZES[size],
              filled
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        );

        if (!interactive) return <span key={n}>{star}</span>;

        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            className="p-0.5 hover:scale-110 transition-transform"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            {star}
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}