'use client';

import { Button } from '@/components/ui/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { Badge } from '@/components/ui/shadcn/badge';
import { ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { IconConfig } from '@/components/ui/image-with-fallback';
import React from 'react';
import { cn } from '@/lib/utils';

interface DropdownFilterProps {
  title: string;
  icon?: IconConfig;
  customIcon?: React.ReactNode;
  fallbackIcon?: React.ComponentType<any>;
  children: React.ReactNode;
  activeCount?: number;
  className?: string;
  open?: boolean;
  triggerClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export default function DropdownFilter({
  title,
  icon,
  customIcon,
  children,
  activeCount = 0,
  className,
  triggerClassName,
  open,
  onOpenChange,
}: DropdownFilterProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={title === 'Category' ? 'accent' : 'secondary'}
          size='default'
          className={cn(
            'group relative h-auto w-full justify-between rounded-none px-4 py-6 text-sm font-semibold leading-6 text-gray-11 data-[state=open]:bg-gray-5',
            triggerClassName,
          )}
        >
          <div className='flex min-w-0 items-center gap-4 leading-6'>
            {customIcon || (
              <ImageWithFallback
                primary={icon?.primary}
                fallback={icon?.fallback}
                alt={title}
                size={24}
              />
            )}

            {title}
          </div>
          <div className='flex items-center gap-1'>
            <Badge
              variant='secondary'
              className={cn(
                'left-6 ml-2 size-5 place-content-center bg-accent-9 p-2 font-medium text-contrast-white empty:invisible 2xl:absolute 2xl:size-3 2xl:translate-y-3 3xl:static 3xl:size-5 3xl:translate-y-0',
              )}
            >
              {activeCount || ''}
            </Badge>

            <ChevronDown className='size-4 transition-transform group-data-[state=open]:rotate-180' />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side='bottom'
        align='start'
        sideOffset={0}
        className={cn(
          'min-w-[var(--radix-dropdown-menu-trigger-width)] divide-y divide-gray-6 overflow-y-auto rounded-none border-gray-6 bg-gray-4 p-0 [&>div]:pointer-events-auto',
          className,
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
