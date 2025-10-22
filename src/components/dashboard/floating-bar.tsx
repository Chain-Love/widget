'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/utils';
import { useProviderSelectionStore } from '@/stores/toolbox/providerSelection';
import { CategoryKey } from '@/service/infrastructureProvidersApi/types';
import { CATEGORIES } from '@/components/dashboard/categories';
import { useShallow } from 'zustand/react/shallow';
import { useSearchParams } from 'next/navigation';

type MinimalRow = { slug: string; provider: string };

export default function FloatingBar({
  selectedRows,
  categoryId,
  className,
}: {
  selectedRows: MinimalRow[];
  categoryId: CategoryKey;
  className?: string;
}) {
  const { unselectSlugs, columnVisibility } = useProviderSelectionStore(
    useShallow(s => ({
      unselectSlugs: s.unselectSlugs,
      columnVisibility: s.columnVisibility,
    })),
  );

  const sp = useSearchParams();
  const network = (sp.get('network') ?? '').trim().toLowerCase();
  const reduce = useReducedMotion();
  const open = selectedRows.length > 0;
  const rootRef = useRef<HTMLDivElement | null>(null);

  function onCompare() {
    const slugs = selectedRows.map(r => encodeURIComponent(r.slug)).join(',');

    // Get all available columns for the category
    const allColumns = CATEGORIES[categoryId].getColumns().filter(Boolean);
    const blacklist = ['actionButtons', 'provider'];

    // Filter available columns and get visible ones based on columnVisibility
    const visibleColumns = allColumns
      .filter((col: any) => col && !blacklist.includes(col.key))
      .filter((col: any) => columnVisibility[col.key] !== false)
      .map((col: any) => col.key);

    // Add columns to URL if we have any visible
    const columnsParam =
      visibleColumns.length > 0
        ? `&columns=${visibleColumns.map((c: string) => encodeURIComponent(c)).join(',')}`
        : '';

    const url = `https://${network}.chain.love/compare/${categoryId}?slugs=${slugs}${columnsParam}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function onClearSelection() {
    unselectSlugs(selectedRows.map(r => r.slug));
  }

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={rootRef}
          key='floating-bar'
          initial={{ y: reduce ? 0 : 48, opacity: reduce ? 1 : 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 48, opacity: reduce ? 1 : 0 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 32,
            mass: 0.6,
          }}
          style={{ willChange: 'transform' }}
          className={cn(
            'sticky inset-x-0 bottom-0 z-50 border-t bg-gray-2/90 p-4 shadow-lg backdrop-blur-[6.5px] supports-[backdrop-filter]:bg-gray-2/80',
            className,
          )}
          role='region'
          aria-label='Selection actions'
        >
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-6'>
              <button
                onClick={onClearSelection}
                className='w-full text-accent-9 transition-colors hover:text-contrast-white'
              >
                Clear All
              </button>

              <Button
                size='default'
                onClick={onCompare}
                className='w-full'
                disabled={selectedRows.length < 2}
              >
                Compare ({selectedRows.length})
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
