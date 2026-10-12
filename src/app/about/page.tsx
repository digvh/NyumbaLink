// src/app/about/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Target, Users, Heart, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'Make finding and listing property in Tanzania simple, safe and accessible to everyone.' },
  { icon: Users, title: 'Our Community', desc: 'We connect tenants, buyers and owners across every region of Tanzania.' },
  { icon: Heart, title: 'Trust First', desc: 'Verified listings and transparent pricing you can rely on.' },
  { icon: TrendingUp, title: 'Growth', desc: 'Helping property owners reach millions of potential clients.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-pink-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            About <span className="gradient-text">NyumbaLink</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            NyumbaLink is Tanzania&apos;s modern property marketplace — connecting people with
            rooms, apartments, lodges and land for sale near them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard padding="lg" className="h-full">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{v.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
