import {
  type CategoryKey,
  type ProvidersResponse,
  categorySchema,
} from '@/service/infrastructureProvidersApi/types';

const ORDER: CategoryKey[] = categorySchema.options as CategoryKey[];

function getChainField(obj: any): 'chain' | null {
  if (!obj || typeof obj !== 'object') return null;
  if ('chain' in obj) return 'chain';
  return null;
}

function countUniqueProviders(arr: any[]): number {
  if (!arr?.length) return 0;
  const uniqueProviders = new Set(
    arr.map(item => item?.provider).filter(provider => provider),
  );
  return uniqueProviders.size;
}

function countUniqueProvidersWithChainFilter(
  arr: any[],
  selectedLower: string,
): number {
  if (!arr?.length) return 0;
  const chainField = getChainField(arr[0]);
  if (!chainField) return countUniqueProviders(arr);

  const filteredByChain = arr.filter(
    it => String(it?.[chainField] ?? '').toLowerCase() === selectedLower,
  );

  return countUniqueProviders(filteredByChain);
}

function countWithChainFilter(arr: any[], selectedLower: string): number {
  if (!arr?.length) return 0;
  const chainField = getChainField(arr[0]);
  if (!chainField) return arr.length;
  return arr.filter(
    it => String(it?.[chainField] ?? '').toLowerCase() === selectedLower,
  ).length;
}

export type AvailableCategoryItem = {
  key: CategoryKey;
  count: number;
  providersCount: number;
};

export function buildAvailableCategories(
  mapResult: ProvidersResponse,
  selectedChainKey?: string | null,
) {
  const present = ORDER.filter(
    k => Array.isArray(mapResult[k]) && mapResult[k]!.length > 0,
  );

  return present.map(k => {
    const arr = mapResult[k] ?? [];

    const selected = selectedChainKey?.toLowerCase().trim();
    const count = selected ? countWithChainFilter(arr, selected) : arr.length;
    const providersCount = selected
      ? countUniqueProvidersWithChainFilter(arr, selected)
      : countUniqueProviders(arr);
    return { key: k, count, providersCount };
  });
}
