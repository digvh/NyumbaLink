// src/app/list-property/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, PlusCircle, MapPin, Coins, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';

const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['HOTEL', 'LODGE', 'SELF_CONTAINED_ROOM', 'LAND', 'BAR', 'RESTAURANT']),
  priceType: z.enum(['PER_NIGHT', 'PER_MONTH', 'SALE']),
  priceTzs: z.number().min(1, 'Price is required'),
  address: z.string().min(3, 'Address is required'),
  district: z.string().min(2, 'District is required'),
  region: z.string().min(2, 'Region is required'),
  viewType: z.enum(['SEA', 'MOUNTAIN', 'CITY', 'GARDEN', 'STREET', 'NONE']),
  hasElevator: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

const selectClass =
  'w-full px-4 py-3.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20';

export default function ListPropertyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: 'HOTEL',
      priceType: 'PER_MONTH',
      viewType: 'NONE',
      hasElevator: false,
    },
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="blob w-96 h-96 bg-indigo-400 top-0 -left-20" />
        <GlassCard padding="lg" className="max-w-md w-full text-center relative z-10">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Sign in to list a property
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need an account to list your property on NyumbaLink.
          </p>
          <Link href="/login">
            <GlassButton variant="gradient" size="lg" fullWidth>
              Go to Login
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const onSubmit = async (data: ListingFormData) => {
    try {
      setIsLoading(true);
      await apiService.createListing(data);
      toast.success('Property listed successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to list property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 bottom-20 -right-20" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <PlusCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            List Your Property
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill in the details below to reach thousands of potential tenants.
          </p>
        </motion.div>

        <GlassCard padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <GlassInput
              placeholder="e.g. Modern 2-bedroom apartment"
              label="Property Title"
              icon={<Home className="w-5 h-5" />}
              error={errors.title?.message}
              {...register('title')}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your property..."
                className={`${selectClass} resize-none`}
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Category, Price Type, Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select className={selectClass} {...register('category')}>
                  <option value="HOTEL">Hotel</option>
                  <option value="LODGE">Lodge</option>
                  <option value="SELF_CONTAINED_ROOM">Self-Contained Room</option>
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="BAR">Bar</option>
                  <option value="LAND">Land for Sale</option>
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Type
                </label>
                <select className={selectClass} {...register('priceType')}>
                  <option value="PER_NIGHT">Per Night</option>
                  <option value="PER_MONTH">Per Month</option>
                  <option value="SALE">For Sale</option>
                </select>
                {errors.priceType && (
                  <p className="mt-2 text-sm text-red-500">{errors.priceType.message}</p>
                )}
              </div>

              <GlassInput
                type="number"
                placeholder="e.g. 250000"
                label="Price (TZS)"
                icon={<Coins className="w-5 h-5" />}
                error={errors.priceTzs?.message}
                {...register('priceTzs', { valueAsNumber: true })}
              />
            </div>

            {/* Address, District, Region */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <GlassInput
                placeholder="Street address"
                label="Address"
                icon={<MapPin className="w-5 h-5" />}
                error={errors.address?.message}
                {...register('address')}
              />
              <GlassInput
                placeholder="e.g. Kinondoni"
                label="District"
                error={errors.district?.message}
                {...register('district')}
              />
              <GlassInput
                placeholder="e.g. Dar es Salaam"
                label="Region"
                error={errors.region?.message}
                {...register('region')}
              />
            </div>

            {/* View Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Type
              </label>
              <select className={selectClass} {...register('viewType')}>
                <option value="NONE">No Special View</option>
                <option value="SEA">Sea View</option>
                <option value="MOUNTAIN">Mountain View</option>
                <option value="CITY">City View</option>
                <option value="GARDEN">Garden View</option>
                <option value="STREET">Street View</option>
              </select>
            </div>

            {/* Submit */}
            <GlassButton
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              List Property
            </GlassButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}