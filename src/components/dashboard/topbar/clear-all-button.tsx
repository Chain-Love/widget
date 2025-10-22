'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/shadcn/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ClearAllButtonProps<TData> {
  table: Table<TData>;
  title: string;
  className?: string;
}

export default function ClearAllButton<TData>({
  title,
  table,
  className,
}: ClearAllButtonProps<TData>) {
  const handleClearAll = () => {
    table.resetColumnFilters();
    table.setGlobalFilter('');

    toast.success('All filters cleared');
  };

  return (
    <Button
      variant='secondary'
      size='default'
      onClick={handleClearAll}
      className={cn(
        'h-auto rounded-none bg-gray-3 px-5 py-4 text-base font-normal text-gray-11 hover:bg-gray-5',
        className,
      )}
    >
      {title}
    </Button>
  );
}
