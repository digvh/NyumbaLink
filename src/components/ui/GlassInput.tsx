// src/components/ui/GlassInput.tsx
'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3.5',
              'bg-white/70 dark:bg-gray-900/70',
              'backdrop-blur-xl',
              'border border-white/30 dark:border-white/10',
              'rounded-2xl',
              'text-gray-900 dark:text-white',
              'placeholder-gray-400',
              'outline-none',
              'transition-all duration-300',
              'focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20',
              'focus:bg-white/90 dark:focus:bg-gray-900/90',
              icon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-red-400',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightIcon}</div>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
export default GlassInput;