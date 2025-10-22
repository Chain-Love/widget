import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  VisibilityState,
  SortingState,
  PaginationState,
  getExpandedRowModel,
} from '@tanstack/react-table';

import { CATEGORIES, filterFns } from '../categories';

import {
  CategoryEntityMap,
  CategoryKey,
} from '@/service/infrastructureProvidersApi/types';
import { useProviderSelectionStore } from '@/stores/toolbox/providerSelection';
import { useShallow } from 'zustand/react/shallow';

import { groupByProvider } from '../group-by-provider';
import ArrayCellPopover from '../fields/shared/array-cell-popover';
import { MarkdownCell } from '@/components/ui/data-table/markdown-cell';

export function useCategoryTable<K extends CategoryKey>(
  categoryId: K,
  data: CategoryEntityMap[K][],
  initialVisibility: VisibilityState,
) {
  const {
    rowSelection,
    setRowSelection,
    columnFilters,
    setColumnFilters,
    columnVisibility: storeVisibility,
    setColumnVisibility,
  } = useProviderSelectionStore(
    useShallow(s => ({
      rowSelection: s.rowSelection,
      setRowSelection: s.setRowSelection,
      columnFilters: s.columnFilters,
      setColumnFilters: s.setColumnFilters,
      columnVisibility: s.columnVisibility,
      setColumnVisibility: s.setColumnVisibility,
    })),
  );

  const [globalFilter, setGlobalFilter] = useState('');
  const deferredFilter = useDeferredValue(globalFilter);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnVisibility: VisibilityState = useMemo(() => {
    return { ...initialVisibility, ...storeVisibility };
  }, [initialVisibility, storeVisibility]);

  useEffect(() => {
    const missing = Object.keys(initialVisibility).some(
      id => storeVisibility[id] === undefined,
    );

    if (!missing) return;

    setColumnVisibility(() => ({ ...initialVisibility }));
  }, [initialVisibility, storeVisibility, setColumnVisibility]);

  const category = CATEGORIES[categoryId];
  const columnHelper = createColumnHelper<CategoryEntityMap[K]>();

  const groupedData = useMemo(() => groupByProvider<K>(data), [data]);

  const columns = useMemo(() => {
    const basic = category.getColumns(data).map(col =>
      columnHelper.accessor(col.key as any, {
        header: () => col.header.label,
        meta: {
          selectAllRows: col.header.selectAllRows,
          headerTooltip: col.header.headerTooltip,
          icon: col.header.icon,
        },
        size: col?.size,
        enableSorting: col.header?.sort !== 'off',
        sortingFn:
          col.header?.sort === 'off' ? undefined : (col.header?.sort ?? 'auto'),
        enableColumnFilter: Boolean(col.cell?.filter) || col.key === 'chain',
        filterFn: col.cell?.filter
          ? filterFns[col.cell?.filter]
          : col.key === 'chain'
            ? (row, colId, value) =>
                String(row.getValue(colId) ?? '').toLowerCase() ===
                String(value ?? '').toLowerCase()
            : undefined,

        cell:
          col.cell?.component ??
          (ctx => {
            const rowAny: any = ctx?.row?.original;

            const isGroup = !!rowAny?.__isGroup;
            if (isGroup) {
              return <ArrayCellPopover title={col.header.label} ctx={ctx} />;
            }
            return <MarkdownCell value={ctx.getValue()} />;
          }),
      }),
    );

    return basic;
  }, [category, columnHelper, data]);

  const table = useReactTable({
    data: groupedData as any,
    columns,
    state: {
      globalFilter: deferredFilter,
      columnFilters,
      columnVisibility,
      sorting,
      pagination,
      rowSelection,
    },

    getRowId: (row: any) =>
      row.__isGroup ? `group:${row.provider}` : row.slug,
    getSubRows: (row: any) => row.__children,
    getRowCanExpand: row => Boolean((row.original as any).__isGroup),
    getExpandedRowModel: getExpandedRowModel(),

    // ✅ https://tanstack.com/table/latest/docs/guide/expanding#filtering-expanded-rows
    filterFromLeafRows: true,

    enableRowSelection: row => !(row.getCanExpand?.() ?? false),
    globalFilterFn: 'includesString',

    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // https://tanstack.com/table/latest/docs/guide/expanding#paginating-expanded-rows
    paginateExpandedRows: false,
  });

  return { table };
}
