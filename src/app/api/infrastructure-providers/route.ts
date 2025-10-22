import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/app/api-helpers/error-response';
import {
  CategoryKey,
  categorySchema,
  ProvidersResponse,
} from '@/service/infrastructureProvidersApi/types';
import {
  fetchRemoteProvidersPayload,
  normalizeOne,
  maybeFilterByInnerChain,
} from '@/app/api-helpers/infrastructure-providers/helpers';
import type { NextApiResponse } from '@/app/api-helpers/types';
import { getAppConfigOnServer } from '@/app/api/config/services';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
): NextApiResponse<ProvidersResponse> {
  const network = req.nextUrl.searchParams.get('network');
  if (!network) return errorResponse('Missing network parameter', 400);

  const categoryParam = req.nextUrl.searchParams.get('category');
  const categoryKeys = categorySchema.options;
  const pickedCategory =
    categoryParam && (categoryKeys as string[]).includes(categoryParam)
      ? (categoryParam as CategoryKey)
      : undefined;

  const rawChain = req.nextUrl.searchParams.get('chain');

  const { dataSources } = await getAppConfigOnServer();

  const matchedKey = Object.keys(dataSources).find(
    k => k.toLowerCase() === network.toLowerCase(),
  );

  const originNetwork = matchedKey
    ? dataSources[matchedKey].originNetwork
    : undefined;

  const allowedChain = new Map<string, string>();
  for (const chain of originNetwork?.chains ?? []) {
    const k = chain.key;
    if (k) allowedChain.set(k.toLowerCase(), k);
  }

  const chainLower = rawChain?.trim().toLowerCase();
  const innerChain =
    chainLower && allowedChain.has(chainLower)
      ? allowedChain.get(chainLower)!
      : undefined;

  try {
    const payload = await fetchRemoteProvidersPayload(network);

    const buildCategory = (k: CategoryKey) => {
      const raw = (payload[k] ?? []).map(normalizeOne);
      return maybeFilterByInnerChain(raw, innerChain);
    };

    if (pickedCategory) {
      return NextResponse.json({
        result: { [pickedCategory]: buildCategory(pickedCategory) },
      });
    }

    const result = Object.fromEntries(
      categoryKeys.map(k => [k, buildCategory(k)]),
    );

    return NextResponse.json({ result });
  } catch {
    return errorResponse('Internal Server Error', 500);
  }
}
