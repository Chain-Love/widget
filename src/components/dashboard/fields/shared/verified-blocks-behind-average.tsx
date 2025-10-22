import { CellProps } from '../../categories';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';

export default function VerifiedBlocksBehindAverage({ ctx }: CellProps<any>) {
  const value = ctx.row.original.verifiedBlocksBehindAvg;

  return (
    <PopoverTooltip>
      <PopoverTrigger className='text-sm text-contrast-white/50'>
        {!value ? 'in development' : value}
      </PopoverTrigger>
      <PopoverContent>
        {!value
          ? 'We are developing this feature at the moment.'
          : `Average blocks behind: ${value}`}
      </PopoverContent>
    </PopoverTooltip>
  );
}
