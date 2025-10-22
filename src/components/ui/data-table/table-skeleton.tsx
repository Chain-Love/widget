'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Table as ReactTable } from '@tanstack/react-table';
import { Skeleton } from '../shadcn/skeleton';
import { Loader } from '../loader';

interface TableSkeleton<TData> {
  table: ReactTable<TData>;
}

export default function TableSkeleton<TData>({ table }: TableSkeleton<TData>) {
  const allColumns = table.getAllColumns();
  const visibility = table.getState().columnVisibility;

  const visibleColumns = useMemo(
    () =>
      allColumns.filter(col => {
        const v = visibility[col.id];
        return v ?? true;
      }),
    [allColumns, visibility],
  );

  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    setVisibleRows(0);

    const id = setInterval(() => {
      setVisibleRows(prev => {
        if (prev + 1 >= 7) {
          clearInterval(id);
          return 7;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(id);
  }, []);

  return (
    <div className='relative mb-2'>
      <div className='space-y-px'>
        {Array.from({ length: 7 }).map((_, rowIdx) => {
          if (rowIdx >= visibleRows) return null;

          return (
            <div key={rowIdx} className='flex items-stretch gap-0 bg-sand-6'>
              <div className='flex items-center py-3 pl-10 pr-5'>
                <div className='size-6 rounded-md border-2 bg-gray-4' />
              </div>

              <div className='flex items-center gap-0 overflow-hidden'>
                {visibleColumns.map(col => {
                  const w = col.getSize?.() ?? 160;
                  return (
                    <div
                      key={col.id}
                      className='flex items-center px-7 py-3'
                      style={{ minWidth: w, maxWidth: w, width: w }}
                    >
                      <Skeleton className='h-6 w-full' />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Loader size='40px' color='white' />
      </div>
    </div>
  );
}
