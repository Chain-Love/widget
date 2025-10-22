import { Table } from '@tanstack/react-table';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { ImageWithFallback } from '../image-with-fallback';

interface SearchProps<TData> {
  table: Table<TData>;
  resetFilters?: () => void;
  className?: string;
  placeholder?: string;
  inputClassName?: string;
  iconClassName?: string;
}

export default function Search<TData>({
  table,
  resetFilters,
  className,
  placeholder = 'Search ...',
  inputClassName,
  iconClassName,
}: SearchProps<TData>) {
  const globalFilter = table.getState().globalFilter ?? '';
  const hasValue = Boolean(globalFilter);

  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      <div
        className={cn(
          'absolute left-5 top-1/2 size-4 -translate-y-1/2 text-gray-11',
          iconClassName,
        )}
      >
        {!hasValue ? (
          <ImageWithFallback
            primary={{ filename: 'search.svg' }}
            fallback={{ lucide: SearchIcon }}
            alt='Search'
            className='size-full'
          />
        ) : (
          <Button
            variant={'ghost'}
            size='icon'
            onClick={() => {
              table.setGlobalFilter('');
            }}
            className='size-full hover:text-contrast-white'
          >
            <Cross2Icon className='size-full' />
          </Button>
        )}
      </div>
      <Input
        placeholder={placeholder}
        value={globalFilter}
        onChange={e => {
          table.setGlobalFilter(String(e.target.value));
          resetFilters?.();
        }}
        className={cn('px-10 text-gray-8', inputClassName)}
      />
    </div>
  );
}
