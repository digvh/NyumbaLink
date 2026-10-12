// src/components/booking/BookingModal.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { Listing } from '@/types/listing';
import { formatPrice } from '@/utils/helpers';
import {
  calculateNights,
  calculateTotal,
  formatDate,
  generateBookingRef,
} from '@/lib/booking';
import { useAvailability } from '@/hooks/useAvailability';
import { useBookingStore, type Booking } from '@/store/bookingStore';
import { useNotificationStore } from '@/store/notificationStore';
import AvailabilityCalendar from './AvailabilityCalendar';
import MpesaModal, { type PaymentProvider } from '@/components/payment/MpesaModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
}

type Step = 'dates' | 'guest' | 'confirm';

export default function BookingModal({ isOpen, onClose, listing }: BookingModalProps) {
  const router = useRouter();
  const { bookedDates } = useAvailability(listing.id);
  const addBooking = useBookingStore((s) => s.addBooking);
  const addNotification = useNotificationStore((s) => s.add);

  const [step, setStep] = useState<Step>('dates');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);

  const nights = useMemo(
    () => (checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0),
    [checkIn, checkOut]
  );
  const total = useMemo(
    () => (nights > 0 ? calculateTotal(nights, listing.priceTzs) : 0),
    [nights, listing.priceTzs]
  );

  const reset = () => {
    setStep('dates');
    setCheckIn(null);
    setCheckOut(null);
    setGuests(1);
    setGuestName('');
    setGuestPhone('');
    setNotes('');
    setPendingBooking(null);
  };

  const handleClose = () => {
    if (payOpen) return;
    reset();
    onClose();
  };

  const canGoToGuest = checkIn && checkOut && nights > 0;
  const canConfirm = guestName.trim().length >= 2 && guestPhone.trim().length >= 9;

  const handleConfirm = () => {
    if (!checkIn || !checkOut) return;
    const ref = generateBookingRef();
    const booking: Booking = {
      id: ref,
      listingId: listing.id,
      listingTitle: listing.title,
      listingPhoto: listing.primaryPhoto,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      nights,
      pricePerNight: listing.priceTzs,
      totalPrice: total,
      currency: 'TZS',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };
    setPendingBooking(booking);
    setPayOpen(true);
  };

  const handlePaymentSuccess = (ref: string, provider: PaymentProvider) => {
    if (!pendingBooking) return;
    const finalBooking: Booking = {
      ...pendingBooking,
      status: 'CONFIRMED',
      paymentMethod: provider,
      paymentReference: ref,
    };
    addBooking(finalBooking);
    addNotification({
      type: 'PAYMENT_SUCCESS',
      title: 'Booking confirmed',
      body: `Your booking at ${listing.title} is confirmed. Ref: ${finalBooking.id}`,
      link: `/bookings`,
    });
    toast.success('Booking confirmed!');
    reset();
    onClose();
    router.push(`/bookings`);
  };

  const handlePaymentFail = (reason: string) => {
    if (!pendingBooking) return;
    const failed: Booking = {
      ...pendingBooking,
      status: 'PENDING',
    };
    addBooking(failed);
    addNotification({
      type: 'BOOKING_NEW',
      title: 'Booking pending',
      body: `Payment failed for ${listing.title}. You can retry from My Bookings.`,
      link: `/bookings`,
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !payOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
              onClick={handleClose}
            />
            <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {step !== 'dates' && (
                      <button
                        onClick={() =>
                          setStep(step === 'confirm' ? 'guest' : 'dates')
                        }
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                      >
                        <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    )}
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 dark:text-white truncate">
                        Book your stay
                      </h2>
                      <p className="text-xs text-gray-500 truncate">{listing.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="px-5 py-3 flex items-center gap-2 shrink-0">
                  <StepDot active={step === 'dates'} done={step !== 'dates'} label="Dates" n={1} />
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-800" />
                  <StepDot active={step === 'guest'} done={step === 'confirm'} label="Guest" n={2} />
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-800" />
                  <StepDot active={step === 'confirm'} done={false} label="Review" n={3} />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pb-5">
                  {step === 'dates' && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Select check-in and check-out
                        </p>
                      </div>
                      <AvailabilityCalendar
                        checkIn={checkIn}
                        checkOut={checkOut}
                        onChange={(ci, co) => {
                          setCheckIn(ci);
                          setCheckOut(co);
                        }}
                        bookedDates={bookedDates}
                        minNights={1}
                      />

                      {checkIn && (
                        <div className="mt-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-3 flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDate(checkIn)}
                            {checkOut && ` → ${formatDate(checkOut)}`}
                          </span>
                          {nights > 0 && (
                            <span className="font-bold text-indigo-700 dark:text-indigo-300">
                              {nights} night{nights > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {step === 'guest' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. John Mwakalinga"
                          className="w-full px-4 py-3.5 bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="0712 345 678"
                          className="w-full px-4 py-3.5 bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Number of guests
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setGuests(n)}
                              className={`w-10 h-10 rounded-2xl font-semibold transition ${
                                guests === n
                                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Special requests (optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder="Late check-in, airport pickup, etc."
                          className="w-full px-4 py-3.5 bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {step === 'confirm' && checkIn && checkOut && (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                        <p className="text-xs text-gray-500 mb-2">Booking summary</p>
                        <div className="space-y-2 text-sm">
                          <Row label="Check-in" value={formatDate(checkIn)} />
                          <Row label="Check-out" value={formatDate(checkOut)} />
                          <Row label="Nights" value={String(nights)} />
                          <Row label="Guests" value={String(guests)} />
                          <Row label="Guest" value={guestName} />
                          <Row label="Phone" value={guestPhone} />
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4">
                        <Row
                          label={`${formatPrice(listing.priceTzs, 'TZS')} × ${nights} night${nights > 1 ? 's' : ''}`}
                          value={formatPrice(total, 'TZS')}
                        />
                        <div className="h-px bg-emerald-500/20 my-3" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total
                          </span>
                          <span className="text-2xl font-bold gradient-text">
                            {formatPrice(total, 'TZS')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 shrink-0">
                  {step === 'dates' && (
                    <button
                      type="button"
                      disabled={!canGoToGuest}
                      onClick={() => setStep('guest')}
                      className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {step === 'guest' && (
                    <button
                      type="button"
                      disabled={!canConfirm}
                      onClick={() => setStep('confirm')}
                      className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Review booking
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {step === 'confirm' && (
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                    >
                      Pay {formatPrice(total, 'TZS')} now
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Payment modal */}
      {pendingBooking && (
        <MpesaModal
          isOpen={payOpen}
          onClose={() => setPayOpen(false)}
          amount={pendingBooking.totalPrice}
          currency={pendingBooking.currency}
          bookingRef={pendingBooking.id}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFail}
        />
      )}
    </>
  );
}

function StepDot({
  active,
  done,
  label,
  n,
}: {
  active: boolean;
  done: boolean;
  label: string;
  n: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
          active
            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg'
            : done
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
        }`}
      >
        {done ? <CheckCircle2 className="w-4 h-4" /> : n}
      </div>
      <span className="text-[10px] font-medium text-gray-500">{label}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}