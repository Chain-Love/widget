'use client';

import { MarkdownCell } from '@/components/ui/data-table/markdown-cell';
import { Badge } from '@/components/ui/shadcn/badge';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';
import { cn } from '@/lib/utils';
import { CellContext } from '@tanstack/react-table';

interface ArrayCellPopoverProps {
  // Accept primitives so we can detect booleans before rendering
  value?: Array<string | number | boolean> | null;
  title?: string;
  className?: string;
  previewCount?: number;
  ctx?: CellContext<any, unknown>;
}

export default function ArrayCellPopover({
  value: rawValue,
  title = 'Items:',
  className,
  previewCount = 1,
  ctx,
}: ArrayCellPopoverProps) {
  let value = rawValue;
  const rowAny: any = ctx?.row?.original;
  const id = ctx?.column?.id as string | undefined;

  const isGroup = !!rowAny?.__isGroup;
  if (isGroup && id) {
    const setData: Array<string | number | boolean> = [];

    (rowAny.__children ?? []).forEach((r: Record<string, unknown>) => {
      const v = (r as any)[id];
      if (Array.isArray(v)) {
        (v as unknown[]).forEach(item => {
          if (item != null) {
            if (
              typeof item === 'string' ||
              typeof item === 'number' ||
              typeof item === 'boolean'
            ) {
              setData.push(item);
            } else {
              setData.push(String(item));
            }
          }
        });
      } else if (v != null) {
        if (
          typeof v === 'string' ||
          typeof v === 'number' ||
          typeof v === 'boolean'
        ) {
          setData.push(v);
        } else {
          setData.push(String(v));
        }
      }
    });

    const unique = Array.from(new Set(setData));
    value = unique as Array<string | number | boolean>;

    // If all aggregated values are boolean, show a compact badge
    if (value.every(v => typeof v === 'boolean')) {
      if (value.length > 1) {
        return <Badge variant='secondary'>Yes/No</Badge>;
      }
      return (
        <Badge variant={'secondary'}>
          {value.every(v => v) ? 'Yes' : 'No'}
        </Badge>
      );
    }
  }

  if (!value || value.length === 0) {
    return <span>-</span>;
  }

  // Convert to strings for rendering beyond this point
  const valueStr: string[] = value.map(v =>
    typeof v === 'string' ? v : String(v),
  );

  const preview = valueStr.slice(0, previewCount);
  const remainingCount = valueStr.length - previewCount;

  if (remainingCount <= 0) {
    return <MarkdownCell value={preview.join(', ')} />;
  }

  return (
    <PopoverTooltip>
      <PopoverTrigger className='cursor-pointer text-sm'>
        <div className='flex h-full items-center gap-1'>
          <MarkdownCell value={preview.join(', ')} />
          {remainingCount > 0 && (
            <>
              {isGroup ? (
                <span className='h-full rounded bg-accent-9 px-1 py-0.5 text-xs text-contrast-white'>
                  +{remainingCount}
                </span>
              ) : (
                <span className='text-accent-9 md:whitespace-nowrap'>
                  +{remainingCount} more
                </span>
              )}
            </>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className={cn('max-w-lg pr-0', className)}>
        <p className='mb-2 font-semibold'>{title}</p>

        <ul
          className={cn(
            'grid gap-2',
            'max-h-64 grid-cols-1 overflow-auto pr-1 sm:grid-cols-2',
          )}
        >
          {valueStr.map((item, idx) => (
            <li
              key={item + idx}
              className='flex items-center justify-between rounded p-1 text-sm hover:bg-gray-10/20'
            >
              <MarkdownCell value={item} className='h-auto' />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </PopoverTooltip>
  );
}
