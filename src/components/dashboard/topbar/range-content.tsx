'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { Slider } from '@/components/ui/shadcn/slider';

type FilterMetaItem = {
  options?: string[] | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  headerComponent?: (ctx: any) => React.ReactElement;
  key: string;
  header: string;
  filterFnKey: string;
  tooltip?: string;
};

interface RangeFilterProps<TData> {
  meta: FilterMetaItem;
  table: Table<TData>;
}

export default function RangeContent<TData>({
  meta,
  table,
}: RangeFilterProps<TData>) {
  const col = table.getColumn(meta.key as any);
  const filterValue = col?.getFilterValue() as number | undefined;

  const handleValueChange = (value: number) => {
    if (value === meta.min) {
      col?.setFilterValue(undefined);
    } else {
      col?.setFilterValue(value);
    }
  };

  const handleClear = () => {
    col?.setFilterValue(undefined);
  };

  return (
    <div className='min-w-80 rounded-none px-6 py-4 2xl:bg-gray-4 2xl:pb-6'>
      <div className='mb-4 flex justify-between text-gray-12'>
        <span>${formatNumber(meta.min ?? 0)}</span>
        <span>${formatNumber(meta.max ?? 100)}</span>
      </div>
      <div className='mb-4'>
        <Slider
          value={[filterValue ?? meta.min ?? 0]}
          min={meta.min ?? 0}
          max={meta.max ?? 100}
          step={meta.step ?? 1}
          onValueChange={v => handleValueChange(v[0])}
          className='border-none'
          trackClassName='bg-gray-5 border-2 h-3 rounded-sm'
          thumbClassName='size-4 bg-contrast-white rounded-md'
        />
      </div>
      <div className='flex items-center justify-between'>
        <span className='font-medium'>
          Current: ${formatNumber(filterValue ?? meta.min ?? 0)}
        </span>
        {filterValue !== undefined && (
          <button
            onClick={handleClear}
            className='text-xs text-gray-11 transition-colors hover:text-gray-12'
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1);
    return `${formatted.replace('.0', '')}M`;
  } else if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return `${formatted.replace('.0', '')}K`;
  }
  return num.toString();
};
