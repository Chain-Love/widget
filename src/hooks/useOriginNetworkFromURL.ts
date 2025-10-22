'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryConfig } from '@/service/configApi';
import type { OriginNetwork } from '@/app_config';

type Result = {
  isLoading: boolean;
  networkKey: string | null;
  originNetwork: OriginNetwork | null;
};

export function useOriginNetworkFromURL(): Result {
  const sp = useSearchParams();
  const { config, isLoading } = useQueryConfig();

  return useMemo<Result>(() => {
    const raw = sp.get('network');
    const key = raw ? raw.trim().toLowerCase() : null;

    const originNetwork =
      key && config?.dataSources?.[key]?.originNetwork
        ? config.dataSources[key]!.originNetwork!
        : null;

    return {
      isLoading,
      networkKey: key,
      originNetwork,
    };
  }, [sp, config, isLoading]);
}
