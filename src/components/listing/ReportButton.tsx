// src/components/listing/ReportButton.tsx
'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import type { Listing } from '@/types/listing';
import ReportModal from './ReportModal';

interface ReportButtonProps {
  listing: Listing;
  variant?: 'icon' | 'text';
}

export default function ReportButton({ listing, variant = 'text' }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 border border-white/40 shadow-lg text-gray-500 hover:text-red-500 transition"
          aria-label="Report listing"
          title="Report listing"
        >
          <Flag className="w-5 h-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs font-semibold text-gray-500 hover:text-red-500 inline-flex items-center gap-1 transition"
        >
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>
      )}

      <ReportModal
        isOpen={open}
        onClose={() => setOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </>
  );
}