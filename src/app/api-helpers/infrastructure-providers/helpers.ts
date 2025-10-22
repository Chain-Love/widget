import fetchClient from '@/service/httpClient';
import {
  CategoryKey,
  CategoryDataMap,
} from '@/service/infrastructureProvidersApi/types';
import { getAppConfigOnServer } from '@/app/api/config/services';

export type RemoteProvidersPayload = Partial<{
  [K in CategoryKey]: CategoryDataMap[K][];
}>;

export async function fetchRemoteProvidersPayload(
  networkParam: string,
): Promise<RemoteProvidersPayload> {
  const network = networkParam.trim().toLowerCase();
  const cfg = await getAppConfigOnServer();

  const url = cfg.dataSources?.[network]?.url;
  if (!url) throw new Error('Invalid or missing network parameter');

  const raw = await fetchClient.get<unknown>(url);

  try {
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Invalid remote providers payload format');
    }
    return payload as RemoteProvidersPayload;
  } catch {
    throw new Error('Failed to parse remote providers payload');
  }
}

export function normalizeOne(item: CategoryDataMap[CategoryKey]) {
  const base = { ...item };

  if ('chain' in base && typeof base.chain === 'string')
    base.chain = base.chain.toLowerCase();

  return base;
}

export function maybeFilterByInnerChain<T extends Record<string, any>>(
  arr: T[],
  innerChain?: string | null,
): T[] {
  if (!innerChain || arr.length === 0) return arr;

  if (!('chain' in arr[0])) return arr;

  const target = innerChain.trim().toLowerCase();
  return arr.filter(it => String((it as any).chain).toLowerCase() === target);
}
