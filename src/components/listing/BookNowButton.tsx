// src/components/listing/BookNowButton.tsx
'use client';

import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import type { Listing } from '@/types/listing';
import BookingModal from '@/components/booking/BookingModal';

interface BookNowButtonProps {
  listing: Listing;
  className?: string;
}

export default function BookNowButton({ listing, className }: BookNowButtonProps) {
  const [open, setOpen] = useState(false);

  // Only show for bookable categories
  const bookable =
    listing.category === 'HOTEL' ||
    listing.category === 'LODGE' ||
    listing.category === 'SELF_CONTAINED_ROOM';

  if (!bookable) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition'
        }
      >
        <CalendarPlus className="w-5 h-5" />
        Book Now
      </button>

      <BookingModal isOpen={open} onClose={() => setOpen(false)} listing={listing} />
    </>
  );
}