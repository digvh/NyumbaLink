// src/components/listing/ReportModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReportStore, type ReportReason } from '@/store/reportStore';
import { useAuthStore } from '@/store/authStore';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: 'SCAM', label: 'Scam or fraud', hint: 'Fake listing asking for money upfront' },
  { value: 'WRONG_INFO', label: 'Wrong information', hint: 'Price, location or details are incorrect' },
  { value: 'ALREADY_SOLD', label: 'Already sold or rented', hint: 'Property is no longer available' },
  { value: 'FAKE_PHOTOS', label: 'Fake photos', hint: 'Photos do not match the actual property' },
  { value: 'DUPLICATE', label: 'Duplicate listing', hint: 'Same property posted multiple times' },
  { value: 'OFFENSIVE', label: 'Offensive content', hint: 'Inappropriate text or images' },
  { value: 'OTHER', label: 'Other', hint: 'Describe the issue below' },
];

export default function ReportModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
}: ReportModalProps) {
  const user = useAuthStore((s) => s.user);
  const { addReport, hasReported } = useReportStore();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const alreadyReported = hasReported(listingId, user?.id);

  const reset = () => {
    setReason(null);
    setDetails('');
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!reason) {
      toast.error('Please choose a reason');
      return;
    }
    if (reason === 'OTHER' && details.trim().length < 10) {
      toast.error('Please describe the issue (min 10 chars)');
      return;
    }

    addReport({
      listingId,
      listingTitle,
      reason,
      details: details.trim() || undefined,
      reporterId: user?.id,
      reporterName: user?.fullName,
    });
    setSubmitted(true);
    toast.success('Report submitted. Thank you!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
            >
              {submitted ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Report received
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    Our team will review your report within 24 hours. Thank you for
                    helping keep NyumbaLink safe.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">Report listing</h2>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {listingTitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {alreadyReported ? (
                      <div className="text-center py-6">
                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          You've already reported this listing
                        </p>
                        <p className="text-sm text-gray-500">
                          Our team is reviewing your previous report.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Why are you reporting this?
                        </p>
                        <div className="space-y-2 mb-5">
                          {REASONS.map((r) => {
                            const active = reason === r.value;
                            return (
                              <button
                                key={r.value}
                                type="button"
                                onClick={() => setReason(r.value)}
                                className={`w-full text-left p-3 rounded-2xl border transition ${
                                  active
                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40'
                                    : 'border-gray-200 dark:border-gray-800 hover:border-red-300 hover:bg-red-50/40 dark:hover:bg-red-950/20'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                                      active
                                        ? 'border-red-500 bg-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                  >
                                    {active && (
                                      <div className="w-full h-full rounded-full bg-white scale-50" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                      {r.label}
                                    </p>
                                    <p className="text-xs text-gray-500">{r.hint}</p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Details */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Additional details {reason === 'OTHER' && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          rows={3}
                          maxLength={500}
                          placeholder="Add any other information that will help our team review this report..."
                          className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 resize-none text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">{details.length}/500</p>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  {!alreadyReported && (
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 shrink-0">
                      <button
                        onClick={handleSubmit}
                        disabled={!reason}
                        className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Submit report
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}