import { z } from 'zod';

import type {
  Rpc,
  Indexing,
  Explorer,
  Oracle,
  Bridge,
  DevTool,
  Faucet,
  Analytic,
  Wallet,
} from './infrastructure.types';

export type CategoryDataMap = {
  rpc: Rpc;
  indexing: Indexing;
  explorer: Explorer;
  oracle: Oracle;
  bridge: Bridge;
  devTool: DevTool;
  faucet: Faucet;
  analytic: Analytic;
  wallet: Wallet;
};

export type CategoryKey = keyof CategoryDataMap;

export const categorySchema = z.enum([
  'rpc',
  'indexing',
  'explorer',
  'oracle',
  'bridge',
  'devTool',
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
