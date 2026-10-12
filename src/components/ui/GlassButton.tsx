// src/components/ui/GlassButton.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'glass' | 'gradient' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function GlassButton({
  children,
  variant = 'gradient',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const variants = {
    glass:
      'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/90',
    gradient:
      'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',
    outline:
      'bg-transparent border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50',
    solid: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-300 overflow-hidden',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}