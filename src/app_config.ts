import { z } from 'zod';

const chainMetaSchema = z.object({
  name: z.string(),
  icon: z.string(),
  key: z.string(),
});

const originNetworkSchema = z.object({
  name: z.string(),
  icon: z.string(),
  chains: z.array(chainMetaSchema).min(1),
});

const dataSourceSchema = z.object({
  url: z.string(),
  originNetwork: originNetworkSchema,
});

export const configSchema = z.object({
  assetsUrl: z.string(),
  proteusShieldDocs: z.string(),
  dataSources: z.record(z.string(), dataSourceSchema),
  hiddenColumns: z.record(z.string(), z.array(z.string())),
});

export type Config = z.infer<typeof configSchema>;
export type DataSourceEntry = z.infer<typeof dataSourceSchema>;
export type OriginNetwork = z.infer<typeof originNetworkSchema>;
export type ChainMeta = z.infer<typeof chainMetaSchema>;
