'use client';

import { useState, type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/service/get-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{props.children}</ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
