// src/app/not-found.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 max-w-md"
      >
        <GlassCard padding="lg">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            404
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Oops — the property you're looking for has gone missing.
          </p>
          <Link href="/search">
            <GlassButton variant="gradient" size="lg" fullWidth icon={<Home className="w-4 h-4" />}>
              Back to Search
            </GlassButton>
          </Link>
          <Link
            href="/"
            className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back home
          </Link>
        </GlassCard>
      </motion.div>
    </div>
  );
}
