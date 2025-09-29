'use client';

import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);

export { CardHeader };