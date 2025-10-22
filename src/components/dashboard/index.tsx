'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VisibilityState } from '@tanstack/react-table';

import Search from '@/components/ui/data-table/search';
import ErrorState from '@/components/ui/data-table/error-state';
import DataTablePagination from '@/components/ui/data-table/pagination';
import TableSkeleton from '@/components/ui/data-table/table-skeleton';
import TopFiltersBar from './topbar';

import {
  buildRangeMeta,
  buildSelectOptions,
} from '@/components/ui/data-table/helpers';
import { CATEGORIES } from './categories';
import { useCategoryTable } from './hooks/useCategoryTable';
import { useInfrastructureProvidersQuery } from '@/service/infrastructureProvidersApi/useInfrastructureProvidersQuery';

import { useQueryConfig } from '@/service/configApi';
import FloatingBar from '@/components/dashboard/floating-bar';
import MobileCards from '@/components/dashboard/mobile-cards';
import { CategoryKey } from '@/service/infrastructureProvidersApi/types';
import { useShallow } from 'zustand/react/shallow';
import { useProviderSelectionStore } from '@/stores/toolbox/providerSelection';

export default function Dashboard() {
  const sp = useSearchParams();
  const hasChainInUrl = Boolean(sp.get('chain')?.trim());

  const { config: appConfig } = useQueryConfig();

  const { data, isLoading, error } = useInfrastructureProvidersQuery();

  const mapResult = useMemo(() => data?.result || {}, [data?.result]);

  const availableKeys = useMemo(
    () => Object.keys(mapResult) as CategoryKey[],
    [mapResult],
  );

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryKey | null>(null);

  useEffect(() => {
    if (!selectedCategoryId || !availableKeys.includes(selectedCategoryId)) {
      setSelectedCategoryId(availableKeys.length ? availableKeys[0] : null);
    }
  }, [availableKeys, selectedCategoryId]);

  const currentCategoryData = useMemo(
    () => (selectedCategoryId ? (mapResult[selectedCategoryId] ?? []) : []),
    [mapResult, selectedCategoryId],
  );

  const defaultHidden = useMemo<string[]>(() => {
    if (!selectedCategoryId) return [];
    const vis =
      CATEGORIES[selectedCategoryId].initialState?.columnVisibility ?? {};
    return Object.entries(vis)
      .filter(([, v]) => v === false)
      .map(([k]) => k);
  }, [selectedCategoryId]);

  const hiddenByConfig = useMemo<string[]>(() => {
    if (!selectedCategoryId) return [];
    const hc = appConfig.hiddenColumns?.[selectedCategoryId];
    return Array.isArray(hc) && hc.length ? hc : defaultHidden;
  }, [appConfig.hiddenColumns, selectedCategoryId, defaultHidden]);

  const initialVisibility = useMemo<VisibilityState>(() => {
    if (!selectedCategoryId || !currentCategoryData.length) return {};
    const ids = CATEGORIES[selectedCategoryId]
      .getColumns(currentCategoryData as any)
      .map(c => String(c.key));
    const hidden = new Set(hiddenByConfig);
    const vis: VisibilityState = {};
    ids.forEach(id => (vis[id] = !hidden.has(id)));
    return vis;
  }, [selectedCategoryId, currentCategoryData, hiddenByConfig]);

  const { table } = useCategoryTable(
    selectedCategoryId ?? 'rpc',
    currentCategoryData,
    initialVisibility,
  );

  const filterMeta = useMemo(
    () =>
      selectedCategoryId
        ? CATEGORIES[selectedCategoryId]
            .getColumns(currentCategoryData as any)
            .filter(c => c.cell?.filter)
            .map(c => ({
              key: c.key,
              header: c.header.label,
              icon: c.header.icon,
              filterFnKey: c.cell?.filter ?? 'none',
              tooltip: c.cell?.tooltip,
              ...(c.cell?.filter === 'range'
                ? buildRangeMeta(currentCategoryData, c.key)
                : {}),
              ...(c.cell?.filter === 'select'
                ? { options: buildSelectOptions(currentCategoryData, c.key) }
                : {}),
              ...(c.cell?.filter === 'multiSelect'
                ? { options: buildSelectOptions(currentCategoryData, c.key) }
                : {}),
            }))
        : [],
    [selectedCategoryId, currentCategoryData],
  );

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map(r => r.original);

  const { resetAll } = useProviderSelectionStore(
    useShallow(s => ({
      resetAll: s.resetAll,
    })),
  );

  return (
    <div className='overflow-visible rounded-lg border-x border-gray-6'>
      <div className='grid w-full grid-cols-[minmax(0px,_1fr)] gap-4'>
        <div className='rounded-xl bg-gray-1'>
          <TopFiltersBar
            table={table}
            selectedCategoryId={selectedCategoryId ?? 'rpc'}
            onCategoryChange={id => {
              setSelectedCategoryId(id);
              resetAll();
              table.reset();
            }}
            filterMeta={filterMeta}
            providersMap={mapResult}
            hideNetworks={hasChainInUrl}
          />
          <Search
            placeholder='Search provider'
            className='max-w-none'
            inputClassName='size-full font-normal py-4 h-auto text-sm leading-6 px-14 focus-visible:ring-0 border-none focus-visible:border-none rounded-none focus-visible:bg-gray-4 bg-gray-1'
            table={table}
            iconClassName='size-6 left-4'
          />

          {isLoading && <TableSkeleton table={table} />}
          {error && <ErrorState message={error.message} />}

          {!isLoading && !error && (
            <>
              <MobileCards table={table} />
              <DataTablePagination table={table} />
            </>
          )}
        </div>
      </div>

      <FloatingBar
        selectedRows={selectedRows.map((r: any) => ({
          slug: r.slug,
          provider: r.provider,
        }))}
        categoryId={(selectedCategoryId ?? 'rpc') as CategoryKey}
      />
    </div>
  );
}
