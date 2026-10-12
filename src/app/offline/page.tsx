// src/app/offline/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home, MapPin } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
        >
          <WifiOff className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          You're offline
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No internet connection detected. Some features may not work until you
          reconnect.
        </p>

        <div className="space-y-3 text-left mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            What you can still do:
          </p>
          <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>View previously loaded map areas</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Home className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>Browse saved listings you've visited</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Retry connection
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-900/70 border border-white/40 dark:border-white/10 shadow-lg hover:bg-white transition"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}