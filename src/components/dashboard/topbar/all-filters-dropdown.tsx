'use client';

import { Table } from '@tanstack/react-table';
import { ChevronDown, Filter, Network, X, Settings2 } from 'lucide-react';
import MultiSelectFilter from './multi-select-content';
import RangeContent from './range-content';
import NetworksRadioSelect from './networks-content';
import AccordionFilter from './accordion-filter';
import BooleanFilterToggle from './boolean-filter-toggle';
import { ColumnVisibilityContent } from './columns-visibility-dropdown';
import { Accordion } from '@/components/ui/shadcn/accordion';
import ClearAllButton from './clear-all-button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from '@/components/ui/shadcn/sheet';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Badge } from '@/components/ui/shadcn/badge';
import { useOriginNetworkFromURL } from '@/hooks/useOriginNetworkFromURL';

type FilterMetaItem = {
  options?: string[] | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  headerComponent?: (ctx: any) => React.ReactElement;
  key: string;
  header: string;
  icon?: any;
  filterFnKey: string;
  tooltip?: string;
};

interface FiltersDropdownProps<TData> {
  filterMeta: FilterMetaItem[];
  table: Table<TData>;
  activeCount?: number;
  hideNetworks?: boolean;
}

export default function AllFiltersDropdown<TData>({
  filterMeta,
  table,
  activeCount = 0,
  hideNetworks = false,
}: FiltersDropdownProps<TData>) {
  // Filter out always-visible columns for counting
  const toggleableColumns = table
    .getAllColumns()
    .filter(c => c.id !== 'actionButtons' && c.id !== 'provider');

  const { originNetwork } = useOriginNetworkFromURL();

  const chainColExists = table.getAllColumns().some(c => c.id === 'chain');
  const chainCount = originNetwork?.chains?.length ?? 0;
  const canShowNetworks = !hideNetworks && chainColExists && chainCount >= 2;

  const chainCol = table.getColumn('chain');
  const chainFilterValue = chainCol?.getFilterValue() as string | undefined;
  const networksActiveCount = chainFilterValue ? 1 : 0;

  // Filters content for mobile and tablet
  const renderFiltersContent = () => (
    <div className='flex h-full flex-col'>
      <Accordion type='single' collapsible>
        <AccordionFilter
          value='columns'
          title='Columns'
          icon={{
            primary: { filename: 'columns.svg' },
            fallback: { lucide: Settings2 },
          }}
          activeCount={toggleableColumns.filter(c => c.getIsVisible()).length}
          totalCount={toggleableColumns.length}
        >
          <ColumnVisibilityContent table={table} />
        </AccordionFilter>
        {canShowNetworks && (
          <AccordionFilter
            value='networks'
            title='Networks'
            icon={{
              primary: { filename: 'plan.svg' },
              fallback: { lucide: Network },
            }}
            activeCount={networksActiveCount}
          >
            <NetworksRadioSelect table={table} />
          </AccordionFilter>
        )}

        {filterMeta.map(meta => {
          if (meta.filterFnKey === 'select') {
            return (
              <BooleanFilterToggle key={meta.key} meta={meta} table={table} />
            );
          }

          if (meta.filterFnKey === 'multiSelect') {
            const col = table.getColumn(meta.key as any);
            const currentValue = col?.getFilterValue();
            const activeCount = Array.isArray(currentValue)
              ? currentValue.length
              : 0;
            return (
              <AccordionFilter
                key={meta.key}
                value={meta.key}
                title={meta.header}
                icon={meta.icon}
                activeCount={activeCount}
              >
                <MultiSelectFilter meta={meta} table={table} />
              </AccordionFilter>
            );
          }

          if (meta.filterFnKey === 'range') {
            const col = table.getColumn(meta.key as any);
            const currentValue = col?.getFilterValue() as number | undefined;
            const activeCount =
              currentValue !== undefined && currentValue !== meta.min ? 1 : 0;

            return (
              <AccordionFilter
                key={meta.key}
                value={meta.key}
                title={meta.header}
                icon={meta.icon}
                activeCount={activeCount}
              >
                <RangeContent meta={meta} table={table} />
              </AccordionFilter>
            );
          }

          return null;
        })}
      </Accordion>

      <ClearAllButton
        className='mt-auto flex w-full max-w-none bg-gray-4 text-accent-9 transition-colors'
        title='Clear filters'
        table={table}
      />
    </div>
  );

  return (
    /* Mobile: Sheet that opens sidebar */
    <Sheet>
      <SheetTrigger
        className={cn(
          'flex size-full items-center justify-center rounded-none bg-gray-3 px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-5',
        )}
      >
        <ImageWithFallback
          primary={{ filename: 'funnel.svg' }}
          fallback={{ lucide: Filter }}
          alt='Filter'
          className='mr-2 size-6 text-gray-11'
        />
        <span className='text-gray-11'>Filter</span>

        <div className='ml-auto flex gap-1 md:gap-6'>
          {activeCount > 0 && (
            <Badge
              variant='outline'
              className={cn(
                'ml-auto size-5 place-content-center bg-accent-9 px-0 font-medium',
              )}
            >
              {activeCount}
            </Badge>
          )}

          <ChevronDown className='size-4 transition-transform group-data-[state=open]:rotate-180' />
        </div>
      </SheetTrigger>
      <SheetContent side='right' className='bg-gray-4 p-0' container={true}>
        <div className='flex h-full flex-col'>
          <SheetHeader className='flex-row items-center justify-between border-b bg-gray-4 p-4'>
            <SheetTitle className='flex items-center gap-2 text-sm font-semibold text-gray-11'>
              <ImageWithFallback
                primary={{ filename: 'funnel.svg' }}
                fallback={{ lucide: Filter }}
                className='size-6 brightness-0 invert-[39%] saturate-0 sepia-0 dark:invert-[71%]'
                alt='Filters'
                size={24}
              />
              Filters
            </SheetTitle>
            <Badge
              variant='outline'
              className={cn(
                'ml-auto mr-3 size-5 place-content-center bg-accent-9 px-0 font-medium empty:invisible',
              )}
            >
              {activeCount || ''}
            </Badge>

            <SheetClose className='opacity-70 transition-opacity'>
              <X className='size-6' />
            </SheetClose>
          </SheetHeader>
          <div className='h-full overflow-y-auto'>{renderFiltersContent()}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
