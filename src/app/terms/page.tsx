// src/app/terms/page.tsx
'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By using NyumbaLink, you agree to these Terms of Service. If you do not agree, please do not use the platform.',
  },
  {
    title: 'Use of the Platform',
    body: 'You agree to provide accurate information and use the platform lawfully and in good faith when listing or inquiring about properties.',
  },
  {
    title: 'Listings and Content',
    body: 'You are responsible for the accuracy of the content you post, including property details, pricing and photos.',
  },
  {
    title: 'Limitation of Liability',
    body: 'NyumbaLink is a marketplace and is not party to any transaction between users. We are not liable for disputes arising from transactions.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Last updated: 2026</p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard padding="md">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{s.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
