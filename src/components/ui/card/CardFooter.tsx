'use client';

import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

const CardFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
);

export { CardFooter };