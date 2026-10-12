// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Message sent! We will get back to you soon.');
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a question? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <GlassCard className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-indigo-500" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Location</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dar es Salaam, Tanzania</p>
          </GlassCard>
          <GlassCard className="text-center">
            <Phone className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Phone</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">+255 123 456 789</p>
          </GlassCard>
          <GlassCard className="text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-pink-500" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">info@nyumbalink.co.tz</p>
          </GlassCard>
        </div>

        <GlassCard padding="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassInput placeholder="Your name" label="Name" required />
              <GlassInput type="email" placeholder="you@example.com" label="Email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                className="w-full px-4 py-3.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none resize-none transition-all duration-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                required
              />
            </div>
            <GlassButton
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={<Send className="w-5 h-5" />}
            >
              Send Message
            </GlassButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
