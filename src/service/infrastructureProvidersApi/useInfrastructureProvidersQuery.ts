import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import httpClient from '../httpClient';
import { SuccessResponse } from '@/app/api-helpers/types';
import { ProvidersResponse } from './types';

const apiQueryKey = '/api/infrastructure-providers';

export function useInfrastructureProvidersQuery() {
  const sp = useSearchParams();
  const search = sp.toString();
  const url = search ? `${apiQueryKey}?${search}` : apiQueryKey;

  return useQuery<SuccessResponse<ProvidersResponse>>({
    queryKey: [apiQueryKey, search],
    queryFn: () => httpClient.get(url),
  });
}
