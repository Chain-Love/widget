'use client';

import React from 'react';
import { Button } from '@/components/ui/shadcn/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from '@/components/ui/shadcn/sheet';
import { Badge } from '@/components/ui/shadcn/badge';
import { ChevronDown, Settings, X } from 'lucide-react';
import { CategoryKey } from '@/service/infrastructureProvidersApi/types';
import { CATEGORIES } from '@/components/dashboard/categories';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

interface CategoriesDropdownProps {
  selectedCategoryId: CategoryKey;
  onCategoryChange: (id: CategoryKey) => void;
  availableCategories: {
    key: CategoryKey;
    count: number;
    providersCount: number;
  }[];
}

export default function CategoriesDropdown({
  selectedCategoryId,
  onCategoryChange,
  availableCategories,
}: CategoriesDropdownProps) {
  const renderCategories = () => (
    <div className='grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-2 [&>*:not(:last-child)]:border-b'>
      {availableCategories.map(c => {
        const isSelected = c.key === selectedCategoryId;
        const fullLabel = CATEGORIES[c.key]?.label ?? c.key;
        const shortLabel = c.key === 'rpc' ? 'RPC' : fullLabel;

        return (
          <Button
            key={c.key}
            variant='ghost'
            onClick={() => onCategoryChange(c.key)}
            className={cn(
              'group relative h-auto w-full min-w-0 rounded-none border-r border-gray-6 bg-gray-4 p-4 transition-colors hover:bg-gray-5',
              'whitespace-normal text-left',
              isSelected && 'bg-gray-5',
            )}
          >
            <div className='relative flex w-full min-w-0 grid-cols-[auto,1fr] flex-col'>
              {/* Mobile: Checkbox and Badge in one row */}
              <div className='mb-2 flex items-center justify-between'>
                <span
                  className={cn(
                    'relative flex size-5 items-center justify-center rounded-full border-2 bg-gray-3',
                    isSelected && 'bg-accent-9',
                  )}
                >
                  <span
                    className={cn(
                      'absolute size-2 rounded-full bg-white transition-opacity',
                      isSelected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </span>
                {/* Count Badge for mobile */}
                {c.providersCount > 0 && (
                  <Badge
                    variant='outline'
                    className='bg-accent-9 px-1.5 text-xs font-medium text-white'
                  >
                    {c.providersCount}
                  </Badge>
                )}
              </div>

              <div className='flex items-center gap-3'>
                {/* Icon → column 3 */}
                <ImageWithFallback
                  primary={(CATEGORIES[c.key]?.icon as any)?.primary}
                  fallback={(CATEGORIES[c.key]?.icon as any)?.fallback}
                  alt={`${c.key} icon`}
                  className='size-8 shrink-0 brightness-0 invert-[39%] saturate-0 sepia-0 dark:invert-[71%]'
                />

                {/* Title → column 2 */}
                <span className='order-2 min-w-0 font-medium tracking-tight group-hover:text-accent-9'>
                  {shortLabel}
                </span>
              </div>

              {/* Description — second row across the width */}
              <div className='mt-2 max-w-max text-xs text-gray-10'>
                {CATEGORIES[c.key]?.description}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );

  return (
    /* Mobile: Sheet that opens sidebar */
    <Sheet>
      <SheetTrigger className='group flex h-auto w-full min-w-0 max-w-[50%] items-center justify-between gap-4 rounded-none bg-accent-9 p-4 hover:bg-accent-9'>
        <ImageWithFallback
          primary={{ filename: `categories.svg` }}
          fallback={{ lucide: Settings }}
          size={24}
          alt='category'
        />
        <p className='text-sm font-medium leading-none text-white'>Category</p>

        <ChevronDown className='size-4 transition-transform group-data-[state=open]:rotate-180' />
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-4/5 border-l-0 bg-gray-4 p-0'
        container={true}
      >
        <div className='flex h-full flex-col'>
          <SheetHeader className='flex-row items-center justify-between border-b p-4'>
            <SheetTitle className='text-2xl font-semibold text-gray-11'>
              Categories
            </SheetTitle>
            <SheetClose className='opacity-70 transition-opacity'>
              <X className='size-6' />
            </SheetClose>
          </SheetHeader>
          <div className='flex-1 overflow-y-auto'>{renderCategories()}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
