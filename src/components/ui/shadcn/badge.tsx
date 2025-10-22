import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-1 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-10 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-9 text-white hover:bg-gray-10',
        secondary: 'border-transparent bg-[#DDEAF8]/[0.07] text-gray-12',
        destructive:
          'border-transparent bg-destructive hover:bg-destructive/80',
        gold: 'border-transparent bg-gold text-black hover:bg-gold/90',
        outline: 'text-white',
        outlineAccent:
          'border border-[#FFBB88]/[0.34] bg-[#AA5500]/[0.74] text-accent-12 dark:bg-[#FBA67C]/[0.05]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
