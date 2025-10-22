import React from 'react';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { Table } from '@tanstack/react-table';

export function SelectAllRows<TData>({ table }: { table: Table<TData> }) {
  const pageLeafRows = table
    .getRowModel()
    .rows.flatMap(r => {
      const leafs = r.getLeafRows?.() ?? [];
      return leafs.length ? leafs : [r];
    })
    .filter(r => !(r.getCanExpand?.() ?? false));

  const allSelected =
    pageLeafRows.length > 0 && pageLeafRows.every(r => r.getIsSelected());
  const someSelected =
    pageLeafRows.some(r => r.getIsSelected()) && !allSelected;

  return (
    <div
      role='presentation'
      onPointerDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
      }}
      className='flex items-center justify-center'
    >
      <Checkbox
        className='data-[state=checked]:bg-accent-9'
        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
        onCheckedChange={v => {
          const next = !!v;
          pageLeafRows.forEach(r => r.toggleSelected(next));
        }}
        aria-label='Select all on page'
      />
    </div>
  );
}
