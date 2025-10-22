import { Config, configSchema } from '@/app_config';
import appConfig from '@/app_config.json';

export async function getAppConfigOnServer(): Promise<Config> {
  return configSchema.parse(appConfig);
}
