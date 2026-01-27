import { z } from 'zod';

import type {
  Api,
  Explorer,
  Oracle,
  Bridge,
  Service,
  SDK,
  Faucet,
  Analytic,
  Wallet,
} from './infrastructure.types';

export type CategoryDataMap = {
  api: Api;
  explorer: Explorer;
  oracle: Oracle;
  bridge: Bridge;
  service: Service;
  sdk: SDK;
  faucet: Faucet;
  analytic: Analytic;
  wallet: Wallet;
};

export type CategoryKey = keyof CategoryDataMap;

export const categorySchema = z.enum([
  'api',
  'explorer',
  'oracle',
  'bridge',
  'service',
  'sdk',
  'faucet',
  'analytic',
  'wallet',
] as [CategoryKey, ...CategoryKey[]]);

export type CategoryEntityMap = {
  [K in CategoryKey]: CategoryDataMap[K];
};

export type ProvidersResponse = Partial<
  Record<CategoryKey, CategoryEntityMap[CategoryKey][]>
>;

export type AvailableCategoriesResponse = {
  availableCategories: {
    key: CategoryKey;
    count: number;
    providersCount: number;
  }[];
};
