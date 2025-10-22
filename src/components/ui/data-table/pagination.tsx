'use client';

import { useMemo } from 'react';
import { Loader } from 'lucide-react';
import { Table } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/shadcn/pagination';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
  rowsPerPageOptions?: number[];
  search?: string;
}

export default function DataTablePagination<TData>({
  table,
  isLoading,
  rowsPerPageOptions = [10, 20, 30, 40, 50],
  search,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const currentPageRows = table.getRowModel().rows.length;

  function getPaginationItems(
    currentPage: number,
    totalPages: number,
    delta = 2,
  ): (number | 'ellipsis')[] {
    const range: (number | 'ellipsis')[] = [];
    let l: number = 0;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        if (l && i - l > 2) {
          range.push('ellipsis');
        } else if (l && i - l === 2) {
          range.push(l + 1);
        }
        range.push(i);
        l = i;
      }
    }

    return range;
  }

  const paginationItems = useMemo(() => {
    if (!search || search === '') {
      return getPaginationItems(pageIndex + 1, pageCount);
    }

    const items: (number | 'ellipsis')[] = getPaginationItems(
      pageIndex + 1,
      pageCount,
    ).filter(item =>
      typeof item === 'number' && item <= pageIndex + 1 ? true : false,
    );

    if (currentPageRows >= pageSize) {
      items.push(pageIndex + 2);
    }

    return items;
  }, [search, pageIndex, pageSize, pageCount, currentPageRows]);

  return (
    <div className='relative border-b border-gray-6 bg-gray-3 p-4 sm:px-10 sm:py-4'>
      <div
        className={cn(
          'flex flex-col gap-4 text-gray-11 transition-opacity sm:flex-row sm:items-center sm:justify-between',
          isLoading && 'pointer-events-none select-none opacity-50',
        )}
      >
        {/* left block: total + rows-per-page */}
        <div className='flex w-full items-center justify-between gap-4 sm:flex-1'>
          <div className='text-sm'>Total: {table.getRowCount()}</div>

          <div className='flex shrink-0 items-center gap-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <Select
              aria-label='Rows per page'
              value={`${pageSize}`}
              onValueChange={value => table.setPageSize(Number(value))}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side='top'>
                {rowsPerPageOptions.length > 0 ? (
                  rowsPerPageOptions.map(size => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={`${pageSize}`}>{pageSize}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* right block: pager */}
        <div className='flex w-full items-center justify-center sm:w-auto sm:flex-none sm:justify-end'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>

              {paginationItems.map((item, index) => (
                <PaginationItem key={index}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      className='size-8'
                      isActive={item - 1 === pageIndex}
                      onClick={() => table.setPageIndex(item - 1)}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  disabled={
                    !table.getCanNextPage() || currentPageRows < pageSize
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {isLoading && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-gray-1/80 backdrop-blur-[1px]'>
          <Loader className='size-5 animate-spin text-gray-11' />
        </div>
      )}
    </div>
  );
}
