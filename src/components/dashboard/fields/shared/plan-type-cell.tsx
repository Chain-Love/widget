'use client';

import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';
import { Badge } from '@/components/ui/shadcn/badge';

import ArrayCellPopover from './array-cell-popover';
import { CellProps } from '../../categories';

export default function PlanTypeCell<Row>({ ctx }: CellProps<Row>) {
  const rowAny: any = ctx.row.original;
  const isGroup = !!rowAny?.__isGroup;

  if (isGroup) {
    return (
      <ArrayCellPopover ctx={ctx as any} title='Plan Type' previewCount={1} />
    );
  }

  const planType = String(ctx.getValue() ?? '');
  const planName = (rowAny?.planName ?? null) as string | null;

  return (
    <>
      {planName ? (
        <div className='flex flex-col gap-2'>
          <span className='font-medium'>{planType || '—'}</span>
          <PopoverTooltip>
            <PopoverTrigger className='cursor-pointer text-left outline-none ring-0 focus-visible:outline-none focus-visible:ring-0'>
              <span className='pl-2 text-xs font-light italic text-gray-11'>
                {`( ${planName} )`}
              </span>
            </PopoverTrigger>
            <PopoverContent className='max-w-sm'>
              This is the name used by the provider to label this plan.
              Different providers may use different names for plans with similar
              features.
            </PopoverContent>
          </PopoverTooltip>
        </div>
      ) : (
        <Badge>{planType || '—'}</Badge>
      )}
    </>
  );
}
