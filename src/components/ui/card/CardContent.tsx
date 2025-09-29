'use client';

import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

export { CardContent };