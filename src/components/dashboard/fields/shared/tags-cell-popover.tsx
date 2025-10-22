'use client';

import {
  PopoverTooltip,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/shadcn/popover';
import { cn } from '@/lib/utils';

interface TagsCellPopoverProps {
  value: string[] | null;
  title?: string;
  className?: string;
  previewCount?: number;
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 60%, 40%, 0.7)`;
}

export default function TagsCellPopover({
  value,
  title = 'Tags:',
  className,
  previewCount = 1,
}: TagsCellPopoverProps) {
  if (!value || value.length === 0) {
    return <span>—</span>;
  }

  const preview = value.slice(0, previewCount);
  const remainingCount = value.length - previewCount;

  const renderTag = (tag: string, idx: number) => (
    <span
      key={tag + idx}
      className='inline-flex items-center justify-center rounded-full border px-2 py-1 text-center text-xs font-medium text-white'
      style={{
        backgroundColor: stringToColor(tag),
        minHeight: '22px',
      }}
    >
      {tag}
    </span>
  );

  if (remainingCount <= 0) {
    return <div className='flex flex-wrap gap-1'>{preview.map(renderTag)}</div>;
  }

  return (
    <PopoverTooltip>
      <PopoverTrigger className='cursor-pointer text-sm'>
        <div className='flex flex-wrap items-center gap-1'>
          {preview.map(renderTag)}
          <span className='text-xs font-semibold text-accent-9'>
            +{remainingCount} more
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('max-w-lg pr-0', className)}>
        <p className='mb-2 font-semibold'>{title}</p>
        <div
          className={cn(
            'grid gap-2',
            'max-h-64 overflow-auto pr-1',
            'grid-cols-1 sm:grid-cols-2',
          )}
        >
          {value.map(renderTag)}
        </div>
      </PopoverContent>
    </PopoverTooltip>
  );
}
