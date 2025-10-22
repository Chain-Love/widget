import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { Button } from '@/components/ui/shadcn/button';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Settings2 } from 'lucide-react';

interface ColumnVisibilityDropdownProps<TData> {
  table: Table<TData>;
  className?: string;
}

const ColumnVisibilityDropdown = <TData,>({
  table,
  className,
}: ColumnVisibilityDropdownProps<TData>) => {
  const allColumns = table.getAllColumns();

  const visibleCount = allColumns.filter(col => col.getIsVisible()).length;

  return (
    <div className={cn('ml-auto flex items-center sm:gap-3', className)}>
      <span className='hidden whitespace-nowrap text-sm sm:block'>
        Visible columns:{' '}
        <strong>
          {visibleCount}/{allColumns.length}
        </strong>
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='default'
            className='border bg-gray-2'
          >
            <Settings2 />
            Columns <ChevronDownIcon className='ml-2 size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side='bottom'
          align='start'
          className='max-h-96 overflow-auto'
        >
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allColumns
            .filter(
              column =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
            )
            .map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onSelect={event => event.preventDefault()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.columnDef.meta?.displayName || column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColumnVisibilityDropdown;
