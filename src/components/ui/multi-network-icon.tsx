'use client';

import { ImageWithFallback } from './image-with-fallback';
import { Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chain {
  key: string;
  icon: string;
  name: string;
  description?: string;
}

interface MultiNetworkIconProps {
  originIcon: string;
  chains: Chain[];
  size?: number;
  className?: string;
}

/**
 * MultiNetworkIcon component displays a main network icon with overlapping chain icons below
 * Used in network dropdowns to show available networks in a compact visual format
 */
export function MultiNetworkIcon({
  originIcon,
  chains,
  size = 24,
  className,
}: MultiNetworkIconProps) {
  // Show maximum 2 chain icons to prevent overcrowding
  const displayChains = chains.slice(0, 2);
  // Calculate spacing for chain icons below main icon
  const bottomOffset = Math.round(size * 0.2);

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size + bottomOffset }}
    >
      {/* Main origin network icon */}
      <ImageWithFallback
        primary={{ filename: originIcon }}
        fallback={{ lucide: Network }}
        alt='Origin network'
        size={size}
        className='rounded-full object-cover shadow-sm'
      />

      {/* Horizontally overlapping chain icons */}
      {displayChains.length > 0 && (
        <div
          className='absolute left-[-6px] flex min-w-[16px]'
          style={{
            bottom: -bottomOffset / 2,
          }}
        >
          {displayChains.map((chain, index) => (
            <div
              key={chain.key}
              style={{
                // Overlap each icon by 5px for compact display
                marginLeft: index > 0 ? -5 : 0,
              }}
            >
              <ImageWithFallback
                primary={{ filename: chain.icon }}
                fallback={{ lucide: Network }}
                alt={chain.name}
                size={16}
                className='size-4 min-w-[16px] rounded-full border border-sand-1 bg-gray-1 object-cover shadow-sm'
              />
            </div>
          ))}

          {/* More networks indicator with three dots */}
          {chains.length > 1 && (
            <div className='ml-[-5px] flex size-4 items-center justify-center rounded-full border border-sand-1 bg-accent-9 shadow-sm'>
              <div className='flex items-center gap-px'>
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className='size-[2px] rounded-full bg-contrast-white'
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
