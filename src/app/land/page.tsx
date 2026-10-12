// src/app/land/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Ruler, ShieldCheck, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';

const features = [
  { icon: MapPin, title: 'Prime Locations', desc: 'Plots in Dar es Salaam, Arusha, Dodoma and more.' },
  { icon: Ruler, title: 'All Sizes', desc: 'From small residential plots to large commercial land.' },
  { icon: ShieldCheck, title: 'Verified Titles', desc: 'Work with verified owners and clear documentation.' },
];

export default function LandPage() {
  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="blob w-96 h-96 bg-green-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-emerald-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Land for <span className="gradient-text">Sale</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Find the perfect plot to build your home, business, or investment.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <GlassButton variant="gradient" size="lg">
                Browse Land Listings <ArrowRight className="w-5 h-5" />
              </GlassButton>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard padding="lg" className="text-center h-full">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
