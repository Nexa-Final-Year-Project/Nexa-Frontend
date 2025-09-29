'use client';

import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);

export { CardTitle };