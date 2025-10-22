'use client';

import { Table as ReactTable, Row, flexRender } from '@tanstack/react-table';
import { SelectAllRows } from '@/components/ui/data-table/select-all-rows';
import {
  Settings,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  CircleMinus,
  CirclePlus,
  ChevronDown,
  X,
  Info as InfoIcon,
  ChevronUp,
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/shadcn/checkbox';
import { Fragment, ReactNode, useState } from 'react';
import { shouldShowStarred } from '../ui/data-table/helpers';
import ActionButton from '../ui/buttons/action-button';
import TableEmptyState from '../ui/data-table/empty-state';
import {
  CategoryEntityMap,
  CategoryKey,
} from '@/service/infrastructureProvidersApi/types';
import { isGroupRow } from './group-by-provider';
import { Cell } from '@tanstack/react-table';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/shadcn/sheet';
import { Badge } from '../ui/shadcn/badge';
import { ColumnVisibilityContent } from './topbar/columns-visibility-dropdown';

type Piece = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};
import {
  PopoverTooltip,
  PopoverTrigger,
  PopoverContent,
} from '../ui/shadcn/popover';

type MobileCardsProps<C extends CategoryKey = CategoryKey> = {
  table: ReactTable<CategoryEntityMap[C]>;
  emptyState?: React.ReactNode;
};

export default function MobileCards<C extends CategoryKey = CategoryKey>({
  table,
  emptyState,
}: MobileCardsProps<C>) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  if (table.getRowModel().rows.length === 0) {
    return <TableEmptyState table={table} emptyState={emptyState} />;
  }

  const rows = table.getRowModel().rows;
  const topRows = rows.filter(r => r.depth === 0);

  const toggleRow = (rowId: string) =>
    setOpenMap(prev => ({ ...prev, [rowId]: !prev[rowId] }));

  const providerCol = table.getColumn('provider');

  // Filter out always-visible columns for counting
  const toggleableColumns = table
    .getAllColumns()
    .filter(c => c.id !== 'actionButtons' && c.id !== 'provider');

  const activeCount = toggleableColumns.filter(c => c.getIsVisible()).length;

  const totalCount = toggleableColumns.length;

  return (
    <div>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <div
            key={headerGroup.id}
            className='flex items-center justify-between gap-3 border-b border-gray-6 bg-gray-3 p-4 px-6'
          >
            <div className='flex items-center gap-4 md:min-w-[310px]'>
              <SelectAllRows table={table} />
              <button
                type='button'
                onClick={providerCol?.getToggleSortingHandler?.()}
                disabled={!providerCol?.getCanSort?.()}
                className='inline-flex items-center gap-1 font-semibold text-gray-11'
              >
                Provider
                {{
                  asc: <ArrowUp className='size-4' />,
                  desc: <ArrowDown className='size-4' />,
                }[providerCol?.getIsSorted() as string] ?? (
                  <ChevronsUpDown className='size-4' />
                )}
              </button>
            </div>
            {headerGroup.headers.map(header => {
              if (!['plan', 'nodeType', 'chain'].includes(header.column.id))
                return null;

              return (
                <Fragment key={header.id}>
                  <div
                    style={{
                      minWidth: header.column.getSize() + 'px',
                    }}
                    className='hidden items-center gap-4 md:flex'
                  >
                    {header.column.columnDef.meta?.selectAllRows && (
                      <SelectAllRows table={table} />
                    )}
                    <div
                      role='button'
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={cn(
                        'flex cursor-default items-center gap-2 font-semibold text-gray-11',
                        header.column.getCanSort() &&
                          'cursor-pointer select-none hover:text-gray-12',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanSort() && (
                        <>
                          {{
                            asc: <ArrowUp className='size-4' />,
                            desc: <ArrowDown className='size-4' />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDown className='size-4' />
                          )}
                        </>
                      )}
                    </div>
                    {header.column.columnDef.meta?.headerTooltip && (
                      <PopoverTooltip>
                        <PopoverTrigger asChild>
                          <InfoIcon
                            width={18}
                            height={18}
                            className='size-[18px] cursor-pointer text-gray-10 transition-[transform,color] duration-200 hover:scale-110 hover:text-gray-12 data-[state=open]:scale-110'
                          />
                        </PopoverTrigger>

                        <PopoverContent>
                          {header.column.columnDef.meta?.headerTooltip}
                        </PopoverContent>
                      </PopoverTooltip>
                    )}
                  </div>
                </Fragment>
              );
            })}

            <div className='ml-auto flex items-center gap-2 rounded p-1 md:ml-0'>
              <Badge
                variant='outline'
                className='flex min-w-14 place-content-center bg-accent-9 text-xs font-medium'
              >
                {totalCount ? `${activeCount}/${totalCount}` : activeCount}
              </Badge>
              <Sheet>
                <SheetTrigger className='flex size-full items-center justify-center rounded-none text-sm font-semibold'>
                  <Settings className='size-5 text-gray-11' aria-hidden />
                </SheetTrigger>
                <SheetContent
                  side='right'
                  className='bg-gray-4 p-0'
                  container={true}
                >
                  <div className='flex h-full flex-col'>
                    <SheetHeader className='flex-row items-center justify-between border-b p-4'>
                      <SheetTitle className='text-xl font-light'>
                        Columns
                      </SheetTitle>

                      <SheetClose className='opacity-70 transition-opacity'>
                        <X className='size-6' />
                      </SheetClose>
                    </SheetHeader>
                    <div className='h-full overflow-y-auto'>
                      <div className='flex h-full flex-col'>
                        <ColumnVisibilityContent table={table} />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        );
      })}
      {topRows.map(row => {
        const rowAny = row.original;
        const isGroup = isGroupRow(rowAny);

        if (isGroup) {
          const expanded = row.getIsExpanded();
          const leafs = row.getLeafRows();
          const allSelected =
            leafs.length > 0 && leafs.every(r => r.getIsSelected());
          const someSelected =
            leafs.some(r => r.getIsSelected()) && !allSelected;
          const actualCount = leafs.length;
          return (
            <Fragment key={row.id}>
              <div
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 border-b border-sand-7 bg-sand-4 p-4 px-6 hover:bg-sand-5',
                  shouldShowStarred(row) &&
                    'dash-accent dash-top-accent dash-bottom-accent border-b-0 bg-[#EBDACA] dark:bg-[#3E3128]',
                )}
                onClick={row.getToggleExpandedHandler()}
              >
                <div className='flex min-w-[250px] items-center md:min-w-[310px]'>
                  <Checkbox
                    className='mr-4 data-[state=checked]:bg-accent-9'
                    checked={
                      allSelected
                        ? true
                        : someSelected
                          ? 'indeterminate'
                          : false
                    }
                    onCheckedChange={v => {
                      const next = !!v;
                      leafs.forEach(r => r.toggleSelected(next));
                    }}
                    onClick={e => e.stopPropagation()}
                    aria-label='Select provider group'
                  />
                  <div
                    className='mr-2 size-6 rounded-full text-accent-9 hover:bg-gray-4 hover:text-gray-11'
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                  >
                    {expanded ? <CircleMinus /> : <CirclePlus />}
                  </div>

                  {/* Sponsored label for groups */}
                  {shouldShowStarred(row) && (
                    <span className='mr-4 flex items-center rounded-sm border border-accent-12 px-2 py-1 text-xs'>
                      <span className='text-[10px] md:mr-[6px]'>AD</span>
                      <span className='hidden md:block'>Sponsored</span>
                    </span>
                  )}

                  {/* Name + Count */}
                  <span className='mr-4 font-medium text-accent-12'>
                    {rowAny.provider}
                  </span>
                  <span className='rounded bg-accent-9 px-2 py-0.5 text-xs text-contrast-white'>
                    +{actualCount}
                  </span>
                </div>
                {row.getVisibleCells().map(cell => {
                  if (!['plan', 'nodeType', 'chain'].includes(cell.column.id))
                    return null;
                  return (
                    <div
                      key={cell.id}
                      className='hidden items-center md:flex'
                      style={{
                        minWidth: cell.column.getSize() + 'px',
                      }}
                    >
                      <div className='text-sm'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className='ml-auto flex items-center justify-end md:ml-0 md:w-[90px]'>
                  {row.getIsExpanded() ? (
                    <ChevronUp className='size-5' />
                  ) : (
                    <ChevronDown className='size-5' />
                  )}
                </div>
              </div>
              {/* Group children  */}
              {row.getIsExpanded() && (
                <>
                  {leafs.map((child: any, idx: number) => (
                    <MobileCard
                      key={child.id}
                      row={child}
                      expanded={!!openMap[child.id]}
                      onToggle={() => toggleRow(child.id)}
                      isLast={idx === leafs.length - 1}
                    />
                  ))}
                </>
              )}
            </Fragment>
          );
        }

        {
          /* Ungrouped root (fallback) */
        }
        return (
          <MobileCard
            key={row.id}
            row={row}
            expanded={!!openMap[row.id]}
            onToggle={() => toggleRow(row.id)}
          />
        );
      })}
    </div>
  );
}

function getCardLabel<C extends CategoryKey>(
  cell: Cell<CategoryEntityMap[C], unknown>,
): ReactNode {
  const meta = cell.column.columnDef.meta;

  // header can be string | ReactNode | (ctx)=>ReactNode
  const rawHeader = cell.column.columnDef.header;

  const label =
    typeof rawHeader === 'function'
      ? (rawHeader as (ctx: unknown) => ReactNode)(cell.getContext())
      : (rawHeader ?? cell.column.id);

  const alt = typeof label === 'string' ? label : String(cell.column.id);

  return (
    <div className='flex items-center gap-2'>
      {meta?.icon && (
        <ImageWithFallback
          primary={meta.icon.primary}
          fallback={meta.icon.fallback}
          className='brightness-0 invert-[39%] saturate-0 sepia-0 dark:invert-[71%]'
          alt={alt}
          size={24}
        />
      )}
      <span>{label}</span>
    </div>
  );
}

function MobileCard<C extends CategoryKey>({
  row,
  expanded,
  onToggle,
  isLast,
}: {
  row: Row<CategoryEntityMap[C]>;
  expanded: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  const cells = row.getVisibleCells();

  // Build card parts
  const pieces: Piece[] = cells.map(cell => {
    const content =
      typeof cell.column.columnDef.cell === 'function'
        ? cell.column.columnDef.cell(cell.getContext())
        : String(cell.getValue?.() ?? '');

    return {
      id: cell.column.id,
      label: getCardLabel(cell),
      content,
    };
  });

  const restPieces = pieces.filter(
    p => p.id !== 'actionButtons' && p.id !== 'provider',
  );

  return (
    <>
      {/* Card header */}
      <div
        className={cn(
          'flex h-[60px] cursor-pointer items-center justify-between gap-4 border-b border-sand-6 bg-sand-3 px-6 font-medium text-accent-12 hover:bg-sand-4',
          expanded && 'border-sand-6 bg-sand-3 hover:bg-sand-4',
          shouldShowStarred(row) &&
            'dash-accent dash-top-accent dash-bottom-accent border-b-0 bg-[#EBDACA] dark:bg-[#3E3128]',
        )}
        onClick={onToggle}
      >
        <div className='flex items-center gap-4 md:min-w-[310px]'>
          <Checkbox
            className='data-[state=checked]:bg-accent-9'
            checked={row.getIsSelected()}
            onCheckedChange={v => row.toggleSelected(!!v)}
            aria-label='Select row'
            onClick={e => e.stopPropagation()}
          />

          {/* Branch bracket for children */}
          {row.depth > 0 && (
            <span
              aria-hidden
              className={cn(
                'relative h-[60px] w-6 shrink-0',
                isLast
                  ? "before:absolute before:bottom-1/2 before:left-1/2 before:top-0 before:w-[2px] before:-translate-x-1/2 before:bg-accent-9 before:content-['']"
                  : "before:absolute before:inset-y-0 before:left-1/2 before:w-[2px] before:-translate-x-1/2 before:bg-accent-9 before:content-['']",
                'after:absolute after:left-1/2 after:top-1/2 after:h-[2px] after:w-[20px] after:-translate-y-1/2 after:bg-accent-9',
              )}
            />
          )}

          {shouldShowStarred(row) && (
            <span className='flex items-center rounded-sm border border-accent-12 px-2 py-1 text-xs'>
              <span className='text-[10px] xs:mr-[6px]'>AD</span>
              <span className='hidden xs:block'>Sponsored</span>
            </span>
          )}

          <span>{row.original.provider}</span>
        </div>

        {row
          .getVisibleCells()
          .filter(cell =>
            ['plan', 'nodeType', 'chain'].includes(cell.column.id),
          )
          .map(cell => (
            <div
              key={cell.id}
              style={{
                minWidth: cell.column.getSize() + 'px',
              }}
              className='hidden items-center md:flex'
            >
              <div className='text-sm'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </div>
          ))}

        <div className='ml-auto flex justify-end md:ml-0 md:w-[90px]'>
          <ChevronDown
            className={cn(
              'size-5 justify-end transition-transform',
              expanded && 'rotate-180',
            )}
          />
        </div>
      </div>

      {/* Card body */}
      {expanded && restPieces.length > 0 && (
        <div className='grid grid-cols-2 bg-gray-4 xs:grid-cols-3'>
          {restPieces.map(p => (
            <div
              key={p.id}
              className='grid grid-rows-[auto_auto] gap-2 border-b border-r border-gray-5 p-4'
            >
              <div className='text-sm font-medium'>{p.label}</div>
              <div className='text-sm opacity-90'>{p.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Card footer actions */}
      {expanded && (
        <ActionButton
          actionButtons={row.original.actionButtons}
          className={cn('grid grid-cols-2 gap-0 border-y p-0')}
          buttonClassName='h-14 w-full rounded-none [&:nth-child(2n)]:border-l [&:nth-child(n+3)]:border-t border-gray-5 [&:only-child]:col-span-2 [&:last-child:nth-child(odd)]:col-span-2'
        />
      )}
    </>
  );
}
