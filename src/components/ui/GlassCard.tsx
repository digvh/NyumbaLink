// src/components/ui/GlassCard.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function GlassCard({
  children,
  className,
  hover = true,
  padding = 'md',
}: GlassCardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative rounded-3xl overflow-hidden',
        'bg-white/70 dark:bg-gray-900/70',
        'backdrop-blur-xl backdrop-saturate-150',
        'border border-white/30 dark:border-white/10',
        'shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
        'transition-all duration-300',
        hover && 'hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)]',
        paddings[padding],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}