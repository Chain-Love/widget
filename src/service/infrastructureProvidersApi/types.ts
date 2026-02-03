import { z } from 'zod';

import type {
  Apis,
  Explorers,
  Oracles,
  Bridges,
  Services,
  SDKs,
  Faucets,
  Analytics,
  Wallets,
} from './infrastructure.types';

export type CategoryDataMap = {
  apis: Apis;
  explorers: Explorers;
  oracles: Oracles;
  bridges: Bridges;
  services: Services;
  sdks: SDKs;
  faucets: Faucets;
  analytics: Analytics;
  wallets: Wallets;
};

export type CategoryKey = keyof CategoryDataMap;

export const categorySchema = z.enum([
  'apis',
  'explorers',
  'oracles',
  'bridges',
  'services',
  'sdks',
  'faucets',
  'analytics',
  'wallets',
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
