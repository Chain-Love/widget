import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-3/[0.08] disabled:text-gray-9/[0.27] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        destructive:
          'bg-destructive/50 shadow-sm hover:bg-destructive/70 focus:ring-1 focus:ring-destructive/50 focus:ring-opacity-50 focus-visible:ring-1 focus-visible:ring-destructive/20',
        outline:
          'border bg-gray-1 shadow-sm hover:bg-gray-4 hover:text-gray-12 focus:ring-1 focus:ring-gray-12 focus:ring-opacity-50 focus-visible:ring-1',
        outlineAccent:
          'border border-accent-8 text-accent-11 hover:text-accent-12 disabled:border-none',
        secondary:
          'bg-gray-9 shadow-sm hover:bg-gray-10 focus:ring-1 focus:ring-gray-10 focus:ring-opacity-50 focus-visible:ring-1 active:opacity-[92]',
        ghost: 'hover:bg-gray-4 hover:text-gray-11',
        link: 'text-gray-12 underline-offset-4 hover:underline',
        accent:
          'bg-accent-9 text-base font-normal text-white duration-500 hover:bg-accent-10 focus:ring-1 focus:ring-accent-10 focus:ring-opacity-50 focus-visible:ring-1 disabled:bg-none',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9',
        accent: 'h-10 min-w-[200px] rounded-full px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'accent',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
