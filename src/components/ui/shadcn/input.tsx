import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-white/5 bg-white/5 px-3 py-1 text-base outline-none transition-[color,box-shadow] selection:bg-gray-12 selection:text-gray-2 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-contrast-white placeholder:text-gray-11 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-gray-8 focus-visible:ring focus-visible:ring-gray-10/50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
