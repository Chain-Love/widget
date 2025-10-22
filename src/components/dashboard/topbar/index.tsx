'use client';

import { ReactElement, useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { CategoryKey } from '@/service/infrastructureProvidersApi/types';
import CategoriesDropdown from './categories-dropdown';
import AllFiltersDropdown from './all-filters-dropdown';
import { IconConfig } from '@/components/ui/image-with-fallback';
import { getTotalActiveFilters } from '@/utils';
import type { ProvidersResponse } from '@/service/infrastructureProvidersApi/types';
import { buildAvailableCategories } from './available-categories';

type FilterMetaItem = {
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  headerComponent?: (ctx: any) => ReactElement;
  key: string;
  header: string;
  icon?: IconConfig;
  filterFnKey: string;
  tooltip?: string;
};

interface TopFiltersBarProps<TData> {
  selectedCategoryId: CategoryKey;
  onCategoryChange: (id: CategoryKey) => void;
  filterMeta: FilterMetaItem[];
  table: Table<TData>;
  providersMap: ProvidersResponse;
  hideNetworks?: boolean;
}

export default function TopFiltersBar<TData>({
  selectedCategoryId,
  onCategoryChange,
  filterMeta,
  table,
  providersMap,
  hideNetworks,
}: TopFiltersBarProps<TData>) {
  const chainCol = table.getColumn('chain');
  const chainFilterValue = chainCol?.getFilterValue() as string | undefined;

  const { isAll, selectedChainKey } = useMemo(() => {
    const key = chainFilterValue?.trim().toLowerCase() ?? '';
    return { isAll: !key, selectedChainKey: key || null };
  }, [chainFilterValue]);

  const availableCategories = useMemo(
    () => buildAvailableCategories(providersMap, selectedChainKey),
    [providersMap, selectedChainKey],
  );

  const shouldShowCategoryFilter = availableCategories.length > 1;

  const totalActiveFilters = getTotalActiveFilters(filterMeta, table, isAll);

  return (
    <div className='flex w-full divide-x divide-gray-6 border-y border-gray-6 bg-gray-3'>
      {shouldShowCategoryFilter && (
        <CategoriesDropdown
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={onCategoryChange}
          availableCategories={availableCategories}
        />
      )}

      <div className='w-full'>
        <AllFiltersDropdown
          filterMeta={filterMeta}
          table={table}
          activeCount={totalActiveFilters}
          hideNetworks={hideNetworks}
        />
      </div>
    </div>
  );
}
