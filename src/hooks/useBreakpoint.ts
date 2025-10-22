'use client';

import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  '3xl': 1920,
};

export type BreakpointKey = keyof typeof BREAKPOINTS;

function pickBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS['3xl']) return '3xl';
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS['xl']) return 'xl';
  if (width >= BREAKPOINTS['lg']) return 'lg';
  if (width >= BREAKPOINTS['md']) return 'md';
  if (width >= BREAKPOINTS['sm']) return 'sm';
  return 'xs';
}

export function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>(
    typeof window !== 'undefined' ? pickBreakpoint(window.innerWidth) : 'xs',
  );

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setWidth(w);
      setBreakpoint(pickBreakpoint(w));
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return { breakpoint, width };
}
