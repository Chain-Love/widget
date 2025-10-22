'use client';

import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/shadcn/accordion';
import React from 'react';
import { IconConfig } from '@/components/ui/image-with-fallback';
import { Badge } from '@/components/ui/shadcn/badge';

interface FilterSectionProps {
  title: string;
  icon?: IconConfig;
  children: React.ReactNode;
  value: string;
  activeCount?: number;
  totalCount?: number;
}

export default function AccordionFilter({
  title,
  icon,
  children,
  value,
  activeCount = 0,
  totalCount,
}: FilterSectionProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className='group m-0 flex h-14 items-center justify-between rounded-none border-b bg-gray-4 px-6 py-4 font-semibold text-gray-11 hover:bg-gray-5 hover:no-underline [&[data-state=open]]:bg-gray-5'>
        <div className='flex items-center gap-2'>
          <ImageWithFallback
            primary={icon?.primary}
            fallback={icon?.fallback}
            alt={title}
            size={24}
            className='brightness-0 invert-[39%] saturate-0 sepia-0 dark:invert-[71%]'
          />

          <p className='text-sm'>{title}</p>
        </div>

        {activeCount > 0 && (
          <Badge
            variant='outline'
            className='ml-auto mr-6 flex place-content-center bg-accent-9 px-[6px] text-xs font-medium'
          >
            {totalCount ? `${activeCount}/${totalCount}` : activeCount}
          </Badge>
        )}
      </AccordionTrigger>

      <AccordionContent className='divide-y divide-gray-6 border-b bg-gray-4 p-0 2xl:bg-gray-4'>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
