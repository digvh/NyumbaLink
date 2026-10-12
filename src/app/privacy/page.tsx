// src/app/privacy/page.tsx
'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const sections = [
  {
    title: 'Information We Collect',
    body: 'We collect the information you provide when creating an account or listing a property, such as your name, phone number and email address.',
  },
  {
    title: 'How We Use Your Information',
    body: 'Your information is used to operate the platform, connect buyers and sellers, and improve your experience on NyumbaLink.',
  },
  {
    title: 'Sharing Your Information',
    body: 'We do not sell your personal data. We only share listing details publicly so that interested parties can contact you.',
  },
  {
    title: 'Data Security',
    body: 'We use reasonable safeguards to protect your personal information from unauthorized access or disclosure.',
  },
];

export default function PrivacyPage() {
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
            Privacy <span className="gradient-text">Policy</span>
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
