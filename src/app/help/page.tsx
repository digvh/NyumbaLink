// src/app/help/page.tsx
'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const faqs = [
  {
    q: 'How do I find a property?',
    a: 'Use the search page to filter by location, price and category. You can also browse the map to explore properties near you.',
  },
  {
    q: 'How do I list my property?',
    a: 'Create an account, then head to "List Property" and fill in your property details. It takes just a few minutes.',
  },
  {
    q: 'Is NyumbaLink free to use?',
    a: 'Browsing and listing properties is free. Premium promotion options are available to featured listings.',
  },
  {
    q: 'How do I contact a property owner?',
    a: 'Each listing shows the owner\u2019s contact information, so you can reach out directly via phone or WhatsApp.',
  },
];

export default function HelpPage() {
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
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Help <span className="gradient-text">Center</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Answers to the most common questions.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard padding="md">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
