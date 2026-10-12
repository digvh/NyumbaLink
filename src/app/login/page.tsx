// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';

const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(data);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob w-96 h-96 bg-indigo-400 top-0 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-0 -right-20" style={{ animationDelay: '2s' }} />
      <div className="blob w-96 h-96 bg-pink-400 top-1/3 left-1/3" style={{ animationDelay: '4s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard padding="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Login to your NyumbaLink account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <GlassInput
              type="tel"
              placeholder="+255 123 456 789"
              label="Phone Number"
              icon={<Phone className="w-5 h-5" />}
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />

            <GlassInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              label="Password"
              icon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Forgot password?
              </Link>
            </div>

            <GlassButton
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </GlassButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl text-gray-500 dark:text-gray-400">
                New here?
              </span>
            </div>
          </div>

          <Link href="/register">
            <GlassButton variant="glass" size="lg" fullWidth>
              Create Account
            </GlassButton>
          </Link>
        </GlassCard>
      </motion.div>
    </div>
  );
}