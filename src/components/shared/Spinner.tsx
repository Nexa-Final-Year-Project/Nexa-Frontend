'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/utils';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={cn(
        'rounded-full border-2 border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
};