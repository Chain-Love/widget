'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      tooltip?: string;
    }
>(({ className, tooltip, children, ...props }, ref) => (
  <div className='flex items-center gap-1'>
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>

    {tooltip && (
      <PopoverTooltip>
        <PopoverTrigger className='text-sm text-contrast-white/50'>
          <Info
            className='size-[18px] text-contrast-white/60 transition-[scale,color] duration-300 hover:scale-110 hover:text-contrast-white group-data-[state=delayed-open]:scale-110'
            onClick={e => e.stopPropagation()}
          />
        </PopoverTrigger>
        <PopoverContent className='max-w-xs'>{tooltip}</PopoverContent>
      </PopoverTooltip>
    )}
  </div>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
