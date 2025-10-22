import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import httpClient from './httpClient';
import { Config } from '@/app_config';
import { SuccessResponse } from '@/app/api-helpers/types';

export const apiQueryKey = '/api/config';

export const configFetchOptions = (origin = '') => {
  return queryOptions({
    queryKey: [apiQueryKey],
    queryFn: () =>
      httpClient.get<SuccessResponse<Config>>(`${origin}${apiQueryKey}`),
    staleTime: 1000 * 60 * 60,
  });
};

export function useQueryConfig() {
  const res = useSuspenseQuery(configFetchOptions());

  return {
    config: res.data.result,
    ...res,
  };
}
