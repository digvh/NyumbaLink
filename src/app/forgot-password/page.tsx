// src/app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, KeyRound, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';

const forgotSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number is required'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      setIsLoading(true);
      await apiService.forgotPassword(data);
      toast.success('If an account exists, a reset link has been sent.');
    } catch {
      toast.success('If an account exists, a reset link has been sent.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="blob w-96 h-96 bg-indigo-400 top-0 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-0 -right-20" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard padding="lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your phone number and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <GlassInput
              type="tel"
              placeholder="+255 123 456 789"
              label="Phone Number"
              icon={<Phone className="w-5 h-5" />}
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
            <GlassButton
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Send Reset Link
            </GlassButton>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
