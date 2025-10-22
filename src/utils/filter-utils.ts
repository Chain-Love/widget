import { Table } from '@tanstack/react-table';

type FilterMetaItem = {
  key: string;
  filterFnKey: string;
  min?: number;
};

export function getTotalActiveFilters<TData>(
  filterMeta: FilterMetaItem[],
  table: Table<TData>,
  isAllNetworks: boolean = true,
): number {
  let totalCount = 0;

  filterMeta.forEach(meta => {
    const col = table.getColumn(meta.key as any);
    const currentValue = col?.getFilterValue();

    if (meta.filterFnKey === 'select') {
      if (currentValue) totalCount += 1;
    } else if (meta.filterFnKey === 'multiSelect') {
      if (Array.isArray(currentValue)) {
        totalCount += currentValue.length;
      }
    } else if (meta.filterFnKey === 'range') {
      if (currentValue !== undefined && currentValue !== meta.min) {
        totalCount += 1;
      }
    }
  });

  if (!isAllNetworks) {
    totalCount += 1;
  }

  return totalCount;
}
