'use client';

import { Link2Icon } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useOriginNetworkFromURL } from '@/hooks/useOriginNetworkFromURL';
import { RadioGroup, RadioGroupItem } from '@/components/ui/shadcn/radio-group';

type Props<TData> = {
  table: Table<TData>;
  className?: string;
};

function RadioRow({
  children,
  selected,
  disabled,
}: {
  children: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-none p-3 px-6',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      data-selected={selected ? '' : undefined}
    >
      <span
        className={cn(
          'flex size-5 items-center justify-center rounded-full border border-gray-8 bg-gray-3',
          selected && 'bg-accent-9',
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full bg-white transition-opacity',
            selected ? 'opacity-100' : 'opacity-0',
          )}
        />
      </span>
      {children}
    </div>
  );
}

export default function NetworksRadioSelect<TData>({
  table,
  className,
}: Props<TData>) {
  const { originNetwork } = useOriginNetworkFromURL();
  const col = table.getColumn('chain');

  const currentValue = (col?.getFilterValue() as string | undefined) ?? 'All';
  const chains = originNetwork?.chains ?? [];

  if (!originNetwork || chains.length < 2 || !col) return null;

  return (
    <RadioGroup
      className={cn('divide-y', className)}
      value={currentValue}
      onValueChange={value =>
        col.setFilterValue(value === 'All' ? undefined : value)
      }
    >
      {/* All Networks */}
      <label className='block'>
        <RadioGroupItem value='All' className='sr-only' />
        <RadioRow selected={currentValue === 'All'}>
          <div className='flex items-center gap-3'>
            <ImageWithFallback
              primary={{ filename: originNetwork.icon }}
              fallback={{ lucide: Link2Icon }}
              alt={originNetwork.name}
              className='size-6 rounded-full object-cover'
            />
            <div className='text-sm font-medium tracking-tight'>
              All Networks
            </div>
          </div>
        </RadioRow>
      </label>

      {/* Specific chains */}
      {chains.map(ch => (
        <label key={ch.key + ch.name} className='block'>
          <RadioGroupItem value={ch.key} className='sr-only' />
          <RadioRow selected={currentValue === ch.key}>
            <div className='flex items-center gap-3'>
              <ImageWithFallback
                primary={{ filename: ch.icon }}
                fallback={{ lucide: Link2Icon }}
                alt={ch.name}
                className='size-6 rounded-full object-cover'
              />
              <div className='text-sm font-medium tracking-tight'>
                {ch.name}
              </div>
            </div>
          </RadioRow>
        </label>
      ))}
    </RadioGroup>
  );
}
