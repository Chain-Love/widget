'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { cn } from '@/lib/utils';
import type { CellContext } from '@tanstack/react-table';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { shouldShowStarred } from '@/components/ui/data-table/helpers';

export default function ProviderCell<Row>({
  ctx,
}: {
  ctx: CellContext<Row, unknown>;
}) {
  const info = ctx;
  const rowAny: any = info.row.original;
  const isGroup = !!rowAny?.__isGroup;

  const isPinned = !!info.column.getIsPinned();
  const showStarred = shouldShowStarred(info.row);

  if (isGroup) {
    const expanded = info.row.getIsExpanded();
    const allLeafs = info.row.getLeafRows?.() ?? [];
    const leafs = allLeafs.filter(r => !(r.getCanExpand?.() ?? false));
    const allSelected = leafs.length > 0 && leafs.every(r => r.getIsSelected());
    const someSelected = leafs.some(r => r.getIsSelected()) && !allSelected;

    const actualCount = leafs.length;

    return (
      <div
        className={cn(
          'flex items-center pr-2 font-medium text-accent-12',
          isPinned && 'md:px-9',
        )}
      >
        {/* Group checkbox */}
        <Checkbox
          className='mr-4 data-[state=checked]:bg-accent-9'
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={v => {
            const next = !!v;
            leafs.forEach(r => r.toggleSelected(next));
          }}
          onClick={e => e.stopPropagation()}
          aria-label='Select provider group'
        />

        {/* Expand/Collapse button */}
        <div
          className='mr-2 size-6 rounded-full text-accent-9 hover:bg-gray-4 hover:text-gray-11'
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <CircleMinus /> : <CirclePlus />}
        </div>

        {/* Name + Count */}
        <span className='mr-4'>{rowAny.provider}</span>
        <span className='ml-1 rounded bg-accent-9 px-2 py-0.5 text-xs text-contrast-white'>
          +{actualCount}
        </span>

        {/* Sponsored label for groups */}
        {showStarred && (
          <span className='ml-4 items-center rounded-sm border border-accent-12 px-2 py-1 text-xs'>
            <span className='mr-[6px] text-[10px]'>AD</span>
            Sponsored
          </span>
        )}
      </div>
    );
  }

  // Leaf row: checkbox + branch + name
  return (
    <div
      className={cn(
        'flex items-center gap-4 pr-2 font-medium text-accent-12',
        isPinned && 'md:px-9',
      )}
    >
      <Checkbox
        className='data-[state=checked]:bg-accent-9'
        checked={info.row.getIsSelected()}
        onCheckedChange={v => info.row.toggleSelected(!!v)}
        onClick={e => e.stopPropagation()}
        aria-label='Select row'
      />

      {info.row.depth > 0 &&
        (() => {
          const rows = info.table.getRowModel().rows;
          const i = rows.findIndex(r => r.id === info.row.id);
          const next = rows[i + 1];
          const isLastChild = !next || next.depth < info.row.depth;

          return (
            <span
              aria-hidden
              className={cn(
                'relative h-[60px] w-6 shrink-0',
                isLastChild
                  ? "before:absolute before:bottom-1/2 before:left-1/2 before:top-0 before:w-[2px] before:-translate-x-1/2 before:bg-accent-9 before:content-['']"
                  : "before:absolute before:inset-y-0 before:left-1/2 before:w-[2px] before:-translate-x-1/2 before:bg-accent-9 before:content-['']",
                'after:absolute after:left-1/2 after:top-1/2 after:h-[2px] after:w-[20px] after:-translate-y-1/2 after:bg-accent-9',
              )}
            />
          );
        })()}

      <span>{String(info.getValue())}</span>

      {showStarred && (
        <span className='ml-4 items-center rounded-sm border border-accent-12 px-2 py-1 text-xs'>
          <span className='mr-[6px] text-[10px]'>AD</span>
          Sponsored
        </span>
      )}
    </div>
  );
}
