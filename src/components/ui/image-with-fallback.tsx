'use client';

import { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useQueryConfig } from '@/service/configApi';

/**
 * Icon with automatic fallback.
 * Supports Lucide components and images (URL / StaticImageData).
 */

type IconImage = { lucide?: LucideIcon; filename?: string };

export type IconConfig = {
  primary?: IconImage;
  fallback?: IconImage;
};

type ImageWithFallbackProps = IconConfig & {
  alt: string;
  className?: string;
  size?: number;
};

export function ImageWithFallback({
  primary,
  fallback,
  alt,
  className,
  size,
}: ImageWithFallbackProps) {
  const [useFallback, setUseFallback] = useState(false);
  const { config } = useQueryConfig();
  const assetsBaseUrl = config.assetsUrl;
  const shouldFallback = useFallback || !assetsBaseUrl;

  // Reset fallback state when primary filename changes
  useEffect(() => {
    setUseFallback(false);
  }, [primary?.filename]);

  const iconSize = size ?? 24;
  if (!primary) {
    return null;
  }

  if (useFallback && !fallback) {
    return (
      <Image
        alt={alt}
        src={'/broken-heart.png'}
        width={iconSize}
        height={iconSize}
        className={cn('object-contain grayscale', className)}
      />
    );
  }

  // Fallback branch
  if (shouldFallback && fallback) {
    if (fallback.lucide) {
      const FallbackIcon = fallback.lucide;
      return (
        <FallbackIcon
          className={cn('shrink-0 text-gray-11', className)}
          size={iconSize}
        />
      );
    }

    if (fallback.filename) {
      return (
        <Image
          alt={alt}
          src={`${assetsBaseUrl}/${fallback.filename}`}
          width={iconSize}
          height={iconSize}
          className={cn('object-contain', className)}
        />
      );
    }
  }

  // Primary branch: render Lucide component
  if (primary.lucide) {
    const IconComponent = primary.lucide;
    return (
      <IconComponent
        className={cn('text-gray-11', className)}
        size={iconSize}
      />
    );
  }

  if (primary.filename) {
    return (
      <Image
        alt={alt}
        src={`${assetsBaseUrl}/${primary.filename}`}
        width={iconSize}
        height={iconSize}
        className={cn('object-contain', className)}
        onError={() => setUseFallback(true)}
      />
    );
  }
}
