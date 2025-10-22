'use client';

import { Table as ReactTable } from '@tanstack/react-table';
import Image from 'next/image';
import { Ghost, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';

type Props<T> = {
  table: ReactTable<T>;
  emptyState?: React.ReactNode;
};

export default function TableEmptyState<T>({ table, emptyState }: Props<T>) {
  const hasFilters =
    !!table.getState().globalFilter ||
    table.getState().columnFilters.length > 0;

  return (
    <div className='h-96 border'>
      <div className='flex h-full flex-col items-center justify-center gap-3 text-gray-11'>
        {hasFilters ? (
          <Image
            src={'/nothing-found.svg'}
            width={128}
            height={134}
            alt='Nothing matched your search.'
            className='h-[134px] w-[128px]'
          />
        ) : (
          <Ghost className='size-8' />
        )}

        <p className='text-contrast-white'>
          {hasFilters
            ? 'Nothing matched your search.'
            : emptyState
              ? ''
              : 'No entries found.'}
        </p>

        {hasFilters ? (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
          >
            <RefreshCcw className='mr-2 size-4' />
            Clear filters
          </Button>
        ) : (
          emptyState
        )}
      </div>
    </div>
  );
}
