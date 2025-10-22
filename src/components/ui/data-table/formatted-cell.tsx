import { cn } from '@/lib/utils';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons';

export default function FormattedCell({
  value,
  formatter,
  prefix = '',
  suffix = '',
  className,
}: {
  value?: string | number | null | boolean;
  formatter?: (value: string | number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  if (typeof value === 'boolean') {
    return (
      <div className={cn('flex justify-center', className)}>
        {value ? (
          <CheckIcon
            aria-hidden='true'
            className='size-7 flex-none text-success/70'
          />
        ) : (
          <Cross1Icon
            aria-hidden='true'
            className='size-6 flex-none text-destructive/70'
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('text-start text-base', className)}>
      {value !== undefined && value !== null
        ? `${prefix}${formatter?.(value) || value}${suffix}`
        : 'N/A'}
    </div>
  );
}
