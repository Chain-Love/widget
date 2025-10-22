import { NextResponse } from 'next/server';

export interface SuccessResponse<T> {
  result: T;
}

export interface ErrorResponse {
  error: { message: string };
}

export type NextApiResponse<T> = Promise<
  NextResponse<SuccessResponse<T> | ErrorResponse>
>;
