'use client';

import React, { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { Check, X, Search, ListChecks } from 'lucide-react';
import {
  MULTISELECT_OPTIONS_META,
  OptionsByValue,
} from '@/components/dashboard/topbar/configs/multiselect-options';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { IconConfig } from '@/components/ui/image-with-fallback';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { cn } from '@/lib/utils';

interface SearchableMultiSelectFilterProps<TData> {
  meta: {
    key: string;
    header: string;
    options?: string[];
  };
  table: Table<TData>;
}

export default function SearchableMultiSelectFilter<TData>({
  meta,
  table,
}: SearchableMultiSelectFilterProps<TData>) {
  const col = table.getColumn(meta.key as any);
  const currentValue = col?.getFilterValue();
  const value = Array.isArray(currentValue) ? (currentValue as string[]) : [];

  const options = meta.options || [];
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort options
  const metaMap =
    MULTISELECT_OPTIONS_META[meta.key] ?? MULTISELECT_OPTIONS_META.default;

  let filtered = [...options];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = options.filter(option => {
      const { label } = getMetaForOption(metaMap, option);
      return label.toLowerCase().includes(query);
    });
  }

  filtered.sort((a, b) => {
    const aChecked = value.includes(a);
    const bChecked = value.includes(b);

    if (aChecked !== bChecked) {
      return aChecked ? -1 : 1;
    }

    const aLabel = getMetaForOption(metaMap, a).label.toLowerCase();
    const bLabel = getMetaForOption(metaMap, b).label.toLowerCase();
    return aLabel.localeCompare(bLabel);
  });

  const filteredOptions = filtered;

  const hasSelectedItems = value.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;

  const unselectedFilteredOptions = hasSearchQuery
    ? filteredOptions.filter(option => !value.includes(option))
    : [];

  const allFilteredSelected =
    hasSearchQuery &&
    filteredOptions.length > 0 &&
    unselectedFilteredOptions.length === 0;

  const handleSelectAllResults = () => {
    if (allFilteredSelected) {
      const next = value.filter(v => !filteredOptions.includes(v));
      col?.setFilterValue(next.length ? next : undefined);
    } else {
      const next = [...value, ...unselectedFilteredOptions];
      col?.setFilterValue(next.length ? next : undefined);
    }
  };

  return (
    <div className='flex flex-col 2xl:max-h-96'>
      {/* Header with search */}
      <div className='flex-shrink-0 border-b border-gray-6 bg-gray-4 p-4'>
        <div className='relative'>
          <div className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-11'>
            {!searchQuery ? (
              <Search className='size-full' />
            ) : (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setSearchQuery('')}
                className='size-full hover:bg-transparent hover:text-gray-12'
              >
                <X className='size-full' />
              </Button>
            )}
          </div>

          <Input
            type='text'
            placeholder={`Search ${meta.header.toLowerCase()}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (
                e.key === 'Enter' &&
                hasSearchQuery &&
                filteredOptions.length > 0
              ) {
                e.preventDefault();
                handleSelectAllResults();
              }
            }}
            className='w-full pl-10'
          />
        </div>
      </div>

      {/* Action buttons (for screens < 2xl) */}
      <div
        className={cn(
          'flex w-full items-center justify-between border-b border-gray-6 transition-all duration-300 ease-in-out 2xl:hidden',
          (hasSearchQuery && filteredOptions.length > 0) || hasSelectedItems
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none max-h-0 overflow-hidden opacity-0',
        )}
      >
        {/* Select All Results - left side, shown only when searching */}
        {hasSearchQuery && filteredOptions.length > 0 ? (
          <Button
            variant='ghost'
            onClick={handleSelectAllResults}
            className='group flex h-auto w-full min-w-[190px] flex-1 justify-start gap-0 rounded-none px-6 py-4 text-gray-12 hover:bg-gray-5 hover:text-gray-12'
          >
            <div
              className={cn(
                'mr-6 flex size-5 items-center justify-center rounded-sm border border-gray-8 bg-gray-3 transition-all',
                allFilteredSelected ? 'bg-accent-9' : 'opacity-70',
              )}
            >
              <Check
                color='white'
                strokeWidth={5}
                className={cn(
                  'size-4 transition-opacity',
                  allFilteredSelected ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>

            <div className='mr-4 flex items-center justify-center'>
              <ListChecks className='size-4 text-gray-12 2xl:size-6' />
            </div>

            <div className='max-w-[270px] gap-1 text-wrap text-left'>
              <div>
                <span className='md:hidden'>Select All</span>
                <span className='hidden md:inline'>Select All Results</span>
              </div>
            </div>
          </Button>
        ) : (
          <div />
        )}
        {/* Clear All - right side, shown when has selected items */}
        {hasSelectedItems && (
          <Button
            variant='link'
            size='sm'
            onClick={() => col?.setFilterValue(undefined)}
            className='ml-auto h-auto p-4 text-sm text-gray-11'
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Options list */}
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {filteredOptions.length === 0 ? (
          <div className='px-6 py-4 text-center text-sm text-gray-10'>
            No options found
          </div>
        ) : (
          filteredOptions.map(option => {
            const checked = value.includes(option);
            const metaMap =
              MULTISELECT_OPTIONS_META[meta.key] ??
              MULTISELECT_OPTIONS_META.default;

            const { icon, label, key } = getMetaForOption(metaMap, option);

            return (
              <Button
                key={option}
                variant='ghost'
                onClick={() => {
                  const next = checked
                    ? value.filter(v => v !== option)
                    : [...value, option];
                  col?.setFilterValue(next.length ? next : undefined);
                }}
                className='group flex h-auto w-full justify-start gap-0 rounded-none px-6 py-4 text-gray-12 hover:bg-gray-5 hover:text-gray-12'
              >
                <div
                  className={cn(
                    'mr-6 flex size-5 items-center justify-center rounded-sm border border-gray-8 bg-gray-3 transition-all',
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

                <div className='mr-4 flex items-center justify-center'>
                  <ImageWithFallback
                    alt={key}
                    primary={icon?.primary}
                    fallback={icon?.fallback}
                    className='size-4 2xl:size-6'
                  />
                </div>

                <div className='max-w-[270px] gap-1 text-wrap text-left'>
                  <div>{label}</div>
                </div>
              </Button>
            );
          })
        )}
      </div>

      {/* Footer with action buttons (for screens >= 2xl) */}
      <div
        className={cn(
          'hidden flex-shrink-0 border-t border-gray-6 bg-gray-4 transition-all duration-300 ease-in 2xl:sticky 2xl:bottom-0 2xl:block',
          (hasSearchQuery && filteredOptions.length > 0) || hasSelectedItems
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none max-h-0 overflow-hidden p-0 opacity-0',
        )}
      >
        <div className='flex w-full items-center justify-between'>
          {/* Select All Results - left side, shown only when searching */}
          {hasSearchQuery && filteredOptions.length > 0 ? (
            <Button
              variant='ghost'
              onClick={handleSelectAllResults}
              className='group flex h-auto flex-1 justify-start gap-0 rounded-none px-6 py-4 text-gray-12 hover:bg-gray-5 hover:text-gray-12'
            >
              <div
                className={cn(
                  'mr-6 flex size-5 items-center justify-center rounded-sm border border-gray-8 bg-gray-3 transition-all',
                  allFilteredSelected ? 'bg-accent-9' : 'opacity-70',
                )}
              >
                <Check
                  color='white'
                  strokeWidth={5}
                  className={cn(
                    'size-3 transition-opacity',
                    allFilteredSelected ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </div>

              <div className='mr-4 flex items-center justify-center'>
                <ListChecks className='size-4 text-gray-11 2xl:size-5' />
              </div>

              <div className='max-w-[270px] gap-1 text-wrap text-left'>
                <div>Select All Results</div>
              </div>
            </Button>
          ) : (
            <div />
          )}
          {/* Clear All - right side, shown when has selected items */}
          {hasSelectedItems && (
            <Button
              variant='link'
              size='sm'
              onClick={() => col?.setFilterValue(undefined)}
              className='ml-auto h-auto p-4 text-sm text-gray-11'
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const getMetaForOption = (
  metaMap: OptionsByValue,
  rawKey: unknown,
): { icon?: IconConfig; label: string; key: string } => {
  const key = String(rawKey).trim();
  const normalized = key.toLowerCase();
  const optionMeta = metaMap[normalized];
  const defaults = metaMap.default ?? {};

  const icon = (optionMeta?.icon || defaults.icon) as IconConfig;
  const label = optionMeta?.label || defaults.label || key;

  return { icon, label, key };
};
