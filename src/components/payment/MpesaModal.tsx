// src/components/payment/MpesaModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Loader2, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/helpers';

export type PaymentProvider = 'MPESA' | 'TIGOPESA' | 'AIRTELMONEY';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: 'TZS' | 'USD';
  bookingRef: string;
  onSuccess: (reference: string, provider: PaymentProvider) => void;
  onFailure?: (reason: string) => void;
}

type Stage = 'phone' | 'processing' | 'awaiting' | 'success' | 'failed';

const PROVIDERS: { value: PaymentProvider; label: string; color: string }[] = [
  { value: 'MPESA', label: 'M-Pesa', color: 'from-red-500 to-red-600' },
  { value: 'TIGOPESA', label: 'Mixx by Yas', color: 'from-blue-500 to-blue-700' },
  { value: 'AIRTELMONEY', label: 'Airtel Money', color: 'from-red-500 to-pink-600' },
];

export default function MpesaModal({
  isOpen,
  onClose,
  amount,
  currency = 'TZS',
  bookingRef,
  onSuccess,
  onFailure,
}: MpesaModalProps) {
  const [provider, setProvider] = useState<PaymentProvider>('MPESA');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<Stage>('phone');
  const [errorMsg, setErrorMsg] = useState('');
  const [reference, setReference] = useState('');

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStage('phone');
      setErrorMsg('');
      setReference('');
    }
  }, [isOpen]);

  const normalizePhone = (raw: string): string => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '255' + digits.slice(1);
    if (!digits.startsWith('255') && digits.length === 9) digits = '255' + digits;
    return digits;
  };

  const isValidPhone = (): boolean => {
    const n = normalizePhone(phone);
    return /^255[67]\d{8}$/.test(n);
  };

  const handlePay = async () => {
    if (!isValidPhone()) {
      toast.error('Enter a valid Tanzanian phone (e.g. 0712345678)');
      return;
    }

    setStage('processing');
    setErrorMsg('');

    // Simulate STK push initiation (~1.5s)
    await sleep(1500);

    // Then show "awaiting PIN" (5s countdown)
    setStage('awaiting');

    // Simulate payment success (~5s)
    await sleep(5000);

    // 90% success rate for demo
    const ok = Math.random() > 0.1;

    if (ok) {
      const ref = `${provider.slice(0, 3)}${Date.now().toString().slice(-8)}`;
      setReference(ref);
      setStage('success');
      toast.success('Payment received!');
      onSuccess(ref, provider);
    } else {
      const msg = 'Payment was cancelled or timed out. Please try again.';
      setErrorMsg(msg);
      setStage('failed');
      onFailure?.(msg);
    }
  };

  const handleClose = () => {
    if (stage === 'processing' || stage === 'awaiting') {
      toast.error('Please wait for the payment to complete');
      return;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">Mobile Money</h2>
                    <p className="text-xs text-gray-500">Ref: {bookingRef}</p>
                  </div>
                </div>
                {stage === 'phone' && (
                  <button
                    onClick={handleClose}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                {stage === 'phone' && (
                  <>
                    {/* Amount */}
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4 mb-5 text-center">
                      <p className="text-xs text-gray-500 mb-1">Amount to pay</p>
                      <p className="text-3xl font-bold gradient-text">
                        {formatPrice(amount, currency)}
                      </p>
                    </div>

                    {/* Provider */}
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Choose provider
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {PROVIDERS.map((p) => {
                        const active = provider === p.value;
                        return (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setProvider(p.value)}
                            className={`p-3 rounded-2xl text-xs font-semibold transition border ${
                              active
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${p.color} mb-1.5`}
                            />
                            {p.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Phone */}
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone number
                    </label>
                    <div className="relative mb-2">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/70 dark:bg-gray-900/70 border border-white/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mb-5">
                      You will receive a prompt to enter your {PROVIDERS.find((p) => p.value === provider)?.label} PIN.
                    </p>

                    <button
                      type="button"
                      onClick={handlePay}
                      className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition"
                    >
                      Pay {formatPrice(amount, currency)}
                    </button>
                  </>
                )}

                {stage === 'processing' && (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="font-bold text-gray-900 dark:text-white mb-1">
                      Sending request...
                    </p>
                    <p className="text-sm text-gray-500">
                      Please wait while we contact {PROVIDERS.find((p) => p.value === provider)?.label}
                    </p>
                  </div>
                )}

                {stage === 'awaiting' && (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                    >
                      <Phone className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">
                      Check your phone
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Enter your PIN on {phone} to complete payment
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Waiting for confirmation...
                    </div>
                  </div>
                )}

                {stage === 'success' && (
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Payment Received!
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Your booking has been confirmed
                    </p>
                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-3 mb-5">
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                        {reference}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
                    >
                      Done
                    </button>
                  </div>
                )}

                {stage === 'failed' && (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                      <XCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Payment Failed
                    </p>
                    <p className="text-sm text-gray-500 mb-5">{errorMsg}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStage('phone')}
                        className="flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                      >
                        Try Again
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-3 rounded-2xl font-bold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}