'use client';

import { useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/shadcn/dropdown-menu';
import { Check, InfoIcon, Settings2 } from 'lucide-react';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';
import type { Table } from '@tanstack/react-table';
import { getColumnMeta } from '@/components/dashboard/topbar/configs/columns-meta';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface ColumnVisibilityContentProps<TData> {
  table: Table<TData>;
}

export const ColumnVisibilityContent = <TData,>({
  table,
}: ColumnVisibilityContentProps<TData>) => {
  const allColumns = table.getAllColumns();

  const sortedColumns = useMemo(() => {
    // Filter out always-visible columns
    const filteredColumns = allColumns.filter(
      column => column.id !== 'actionButtons' && column.id !== 'provider',
    );

    return filteredColumns.sort((a, b) => {
      const aDisabled = getColumnMeta(a.id)?.disabled === true;
      const bDisabled = getColumnMeta(b.id)?.disabled === true;
      // Enabled columns first, disabled columns last
      if (aDisabled && !bDisabled) return 1;
      if (!aDisabled && bDisabled) return -1;
      return 0;
    });
  }, [allColumns]);

  return (
    <>
      {sortedColumns.map(column => {
        const columnMeta = getColumnMeta(column.id);
        const isDisabled = columnMeta?.disabled === true;
        const checked = column.getIsVisible();

        return (
          <Button
            key={column.id}
            variant='ghost'
            onClick={() => {
              if (!isDisabled) {
                column.toggleVisibility(!column.getIsVisible());
              }
            }}
            className={cn(
              'group flex h-auto w-full justify-between gap-0 rounded-none px-6 py-4 text-gray-12 hover:bg-gray-5 hover:text-gray-12',
              isDisabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <div className='flex items-center gap-6'>
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded-sm border border-gray-8 bg-gray-3 transition-all',
                  checked ? 'bg-accent-9' : 'opacity-70',
                )}
              >
                <Check
                  color='white'
                  strokeWidth={5}
                  className={cn(
                    'size-3 transition-opacity',
                    checked ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </div>

              <div className='max-w-[270px] gap-1 text-wrap text-left'>
                <div className='text-sm font-medium'>
                  {columnMeta?.displayName || (column.id as string)}
                </div>
              </div>
            </div>
            <PopoverTooltip>
              <PopoverTrigger
                className={cn(isDisabled ? 'cursor-help' : 'cursor-pointer')}
              >
                <InfoIcon
                  className={cn(
                    'size-[18px] transition-[scale_color] duration-300 hover:scale-110 group-data-[state=delayed-open]:scale-110',
                  )}
                />
              </PopoverTrigger>
              <PopoverContent side='left' className='max-w-[260px]'>
                {isDisabled
                  ? 'Functionality in development'
                  : columnMeta?.description || 'No description available'}
              </PopoverContent>
            </PopoverTooltip>
          </Button>
        );
      })}
    </>
  );
};

export default function ColumnVisibilityDropdown<TData>({
  table,
}: ColumnVisibilityContentProps<TData>) {
  const allColumns = table.getAllColumns();

  // Filter out always-visible columns for counting
  const toggleableColumns = allColumns.filter(
    c => c.id !== 'actionButtons' && c.id !== 'provider',
  );

  const visibleCount = toggleableColumns.filter(c => c.getIsVisible()).length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='secondary'
            size='default'
            className='group h-auto min-w-fit justify-between rounded-none bg-gray-3 px-4 py-6 hover:bg-gray-5 data-[state=open]:bg-gray-5'
          >
            <span className='flex items-center gap-2'>
              <ImageWithFallback
                primary={{ filename: 'columns.svg' }}
                fallback={{ lucide: Settings2 }}
                alt='settings'
              />
              Columns
              <Badge
                variant='outline'
                className={cn(
                  'ml-2 min-w-14 place-content-center bg-accent-9 text-center font-medium',
                )}
              >
                {visibleCount}/{toggleableColumns.length}
              </Badge>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side='bottom'
          align='start'
          sideOffset={0}
          className='max-h-[40vh] min-w-[320px] divide-y overflow-y-auto overscroll-contain rounded-none bg-gray-4 p-0'
        >
          <ColumnVisibilityContent table={table} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
