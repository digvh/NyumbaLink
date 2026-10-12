// src/components/ui/Loading.tsx
'use client';

import { cn } from '@/utils/helpers';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function Loading({ size = 'md', text, className }: LoadingProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600',
          sizes[size]
        )}
      />
      {text && <p className="mt-3 text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
}