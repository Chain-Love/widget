'use client';

import React from 'react';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/shadcn/dropdown-menu';
import { Table } from '@tanstack/react-table';

import { IconConfig } from '@/components/ui/image-with-fallback';

interface BooleanFilterSelectProps<TData> {
  meta: {
    key: string;
    header: string;
    icon?: IconConfig;
    options?: string[];
  };
  table: Table<TData>;
}

interface RadioItemProps {
  value: string;
  children: React.ReactNode;
}

function RadioItem({ value, children }: RadioItemProps) {
  return (
    <DropdownMenuRadioItem
      value={value}
      className='group flex cursor-pointer gap-3 rounded-none p-3 [&>span.absolute>span>svg]:hidden'
    >
      <span className='flex size-5 items-center justify-center rounded-full border border-gray-8 bg-gray-3 group-data-[state=checked]:bg-accent-9'>
        <span className='size-2 rounded-full bg-contrast-white opacity-0 transition-opacity group-data-[state=checked]:opacity-100' />
      </span>
      {children}
    </DropdownMenuRadioItem>
  );
}

export default function BooleanFilterSelect<TData>({
  meta,
  table,
}: BooleanFilterSelectProps<TData>) {
  const col = table.getColumn(meta.key as any);
  const currentValue = col?.getFilterValue();

  return (
    <DropdownMenuRadioGroup
      className='divide-y'
      value={currentValue ? (currentValue as string) : 'All'}
      onValueChange={value =>
        col?.setFilterValue(value === 'All' ? undefined : value)
      }
    >
      <RadioItem value='All'>All</RadioItem>
      {meta.options?.map(option => (
        <RadioItem key={option} value={option}>
          {option}
        </RadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
