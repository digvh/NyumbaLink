// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Page error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="blob w-96 h-96 bg-red-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-orange-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We hit an unexpected error. Our team has been notified. Try again or
          return home.
        </p>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="mb-6 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-left">
            <p className="text-xs font-mono text-red-700 dark:text-red-300 break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-900/70 border border-white/40 dark:border-white/10 shadow-lg hover:bg-white transition"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Still stuck?{' '}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}