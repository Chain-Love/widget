import { NextResponse } from 'next/server';
import { NextApiResponse } from '@/app/api-helpers/types';
import { errorResponse } from '@/app/api-helpers/error-response';
import { Config } from '@/app_config';
import { getAppConfigOnServer } from './services';

export const dynamic = 'force-dynamic';

export async function GET(): NextApiResponse<Config> {
  try {
    const result = await getAppConfigOnServer();
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error reading config:', error);
    return errorResponse('Internal server error', 500);
  }
}
