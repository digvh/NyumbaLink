// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, User, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Full name is required'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = data;
      const response = await apiService.register(registerData);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Access to verified listings',
    'Direct owner contact',
    'Save favorite properties',
    'Real-time notifications',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob w-96 h-96 bg-blue-400 top-0 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-0 -right-20" style={{ animationDelay: '2s' }} />
      <div className="blob w-96 h-96 bg-pink-400 top-1/3 right-1/3" style={{ animationDelay: '4s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Benefits */}
          <GlassCard padding="lg" className="hidden md:flex flex-col justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Join <span className="gradient-text">NyumbaLink</span> Today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Create your free account and start finding your perfect home in Tanzania
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>

          {/* Right: Form */}
          <GlassCard padding="lg">
            <div className="text-center mb-6 md:hidden">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              It's free and takes less than a minute
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <GlassInput
                type="text"
                placeholder="Enter your full name"
                label="Full Name"
                icon={<User className="w-5 h-5" />}
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <GlassInput
                type="tel"
                placeholder="+255 123 456 789"
                label="Phone Number"
                icon={<Phone className="w-5 h-5" />}
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />

              <GlassInput
                type="email"
                placeholder="your@email.com (optional)"
                label="Email"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <GlassInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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

              <GlassInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                label="Confirm Password"
                icon={<Lock className="w-5 h-5" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <GlassButton
                type="submit"
                variant="gradient"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Create Account
              </GlassButton>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Sign in
              </Link>
            </p>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}