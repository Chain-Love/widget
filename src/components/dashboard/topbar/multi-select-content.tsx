'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { Check } from 'lucide-react';
import {
  MULTISELECT_OPTIONS_META,
  OptionsByValue,
} from '@/components/dashboard/topbar/configs/multiselect-options';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { IconConfig } from '@/components/ui/image-with-fallback';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/utils';
interface MultiSelectFilterProps<TData> {
  meta: {
    key: string;
    header: string;
    options?: string[];
  };
  table: Table<TData>;
}

export default function MultiSelectFilter<TData>({
  meta,
  table,
}: MultiSelectFilterProps<TData>) {
  const col = table.getColumn(meta.key as any);
  const currentValue = col?.getFilterValue();
  const value = Array.isArray(currentValue) ? (currentValue as string[]) : [];

  const options = meta.options || [];

  return (
    <>
      {options.map(option => {
        const checked = value.includes(option);
        const metaMap =
          MULTISELECT_OPTIONS_META[meta.key] ??
          MULTISELECT_OPTIONS_META.default;

        const { icon, label, description, key } = getMetaForOption(
          metaMap,
          option,
        );

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
                className='size-6 brightness-0 invert-[39%] saturate-0 sepia-0 dark:invert-[71%] 2xl:size-10'
              />
            </div>

            <div className='max-w-[270px] gap-1 text-wrap text-left'>
              <div>{label}</div>
              {description && (
                <div className='hidden text-xs text-gray-10 2xl:block'>
                  {description}
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </>
  );
}

const getMetaForOption = (
  metaMap: OptionsByValue,
  rawKey: unknown,
): { icon?: IconConfig; label: string; description: string; key: string } => {
  const key = String(rawKey).trim();
  const normalized = key.toLowerCase();
  const optionMeta = metaMap[normalized];
  const defaults = metaMap.default ?? {};

  const icon = (optionMeta?.icon || defaults.icon) as IconConfig;
  const label = optionMeta?.label || defaults.label || key;
  const description =
    optionMeta?.description || (defaults.description as string);

  return { icon, label, description, key };
};
