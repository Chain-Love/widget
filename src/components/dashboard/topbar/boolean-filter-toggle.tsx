'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';

import { Tag } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

interface BooleanFilterToggleProps<TData> {
  meta: {
    key: string;
    header: string;
    options?: string[];
  };
  table: Table<TData>;
}

export default function BooleanFilterToggle<TData>({
  meta,
  table,
}: BooleanFilterToggleProps<TData>) {
  const col = table.getColumn(meta.key as any);
  const currentValue = col?.getFilterValue();

  const options = ['All', 'Yes', 'No'];

  const renderToggleButtons = () => {
    return options.map((option, index) => {
      const activeIndex = options.findIndex(
        o => o === currentValue || (!currentValue && o === 'All'),
      );
      const isActive = index === activeIndex;
      const isLast = index === options.length - 1;
      const nextIsActive = index + 1 === activeIndex;

      const showDivider = !isLast && !isActive && !nextIsActive;

      return (
        <button
          key={option}
          onClick={() =>
            col?.setFilterValue(option === 'All' ? undefined : option)
          }
          className={cn(
            'relative w-full rounded-md py-2 leading-6 transition-colors md:text-sm',
            showDivider &&
              'before:absolute before:right-0 before:top-1/2 before:h-4/5 before:w-px before:-translate-y-1/2 before:bg-gray-7',
            isActive ? 'border bg-gray-1' : 'hover:bg-gray-5',
          )}
        >
          {option}
        </button>
      );
    });
  };

  return (
    <div className='flex flex-col justify-center gap-6 border-b bg-gray-4 px-6 py-4 md:h-14'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <ImageWithFallback
            primary={{ filename: 'trial.svg' }}
            className='size-6 brightness-0 invert-[39%] saturate-0 sepia-0 dark:invert-[71%]'
            fallback={{ lucide: Tag }}
            alt='tag'
          />
          <span className='text-sm text-gray-11'>{meta.header}</span>
        </div>

        <div className='hidden min-w-[180px] rounded-md bg-gray-5 md:flex [&>*]:basis-1/3 md:[&>*]:basis-auto'>
          {renderToggleButtons()}
        </div>
      </div>

      <div className='flex rounded-md bg-gray-5 md:hidden [&>*]:basis-1/3'>
        {renderToggleButtons()}
      </div>
    </div>
  );
}
