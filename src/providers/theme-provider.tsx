'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useSearchParams } from 'next/navigation';

function getUrlTheme(
  sp: ReturnType<typeof useSearchParams>,
): 'light' | 'dark' | 'system' {
  const t = sp.get('theme')?.toLowerCase();
  return t === 'light' || t === 'dark' ? (t as 'light' | 'dark') : 'system';
}

export function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const sp = useSearchParams();
  const defaultTheme = getUrlTheme(sp);

  return (
    <NextThemesProvider
      attribute='class'
      enableSystem
      defaultTheme={defaultTheme}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
