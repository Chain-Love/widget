import { NextResponse } from 'next/server';
import { ErrorResponse } from './types';

export function errorResponse(
  message: string,
  status: number,
): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: { message } }, { status });
}
