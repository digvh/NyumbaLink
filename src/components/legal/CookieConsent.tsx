// src/components/legal/CookieConsent.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'nyumbalink-cookie-consent-v1';

interface Consent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  const acceptAll = () =>
    save({
      essential: true,
      analytics: true,
      marketing: true,
      acceptedAt: new Date().toISOString(),
    });

  const rejectNonEssential = () =>
    save({
      essential: true,
      analytics: false,
      marketing: false,
      acceptedAt: new Date().toISOString(),
    });

  const savePrefs = () =>
    save({
      essential: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      acceptedAt: new Date().toISOString(),
    });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pointer-events-none"
        >
          <div className="container-custom">
            <div className="pointer-events-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-5 md:p-6">
              {!showDetails ? (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">
                      We use cookies to improve your experience
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      We use essential cookies to run the site and optional cookies for analytics. You can accept all, reject non-essential, or customize. Read our{' '}
                      <Link href="/privacy" className="text-indigo-600 hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowDetails(true)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Customize
                    </button>
                    <button
                      onClick={rejectNonEssential}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={acceptAll}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Cookie Preferences
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <PrefRow
                      title="Strictly Necessary"
                      description="Required to run the site (login, security)."
                      checked
                      disabled
                    />
                    <PrefRow
                      title="Analytics"
                      description="Helps us understand how visitors use NyumbaLink."
                      checked={prefs.analytics}
                      onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                    />
                    <PrefRow
                      title="Marketing"
                      description="Used to show relevant offers. Off by default."
                      checked={prefs.marketing}
                      onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-5">
                    <button
                      onClick={rejectNonEssential}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={savePrefs}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PrefRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 ${
        disabled ? 'opacity-70' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <div>
        <p className="font-semibold text-sm text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </label>
  );
}