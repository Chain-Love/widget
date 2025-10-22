import { CellProps } from '../../categories';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';

export default function VerifiedUptime({ ctx }: CellProps<any>) {
  const value = ctx.row.original.verifiedUptime;

  return (
    <PopoverTooltip>
      <PopoverTrigger className='text-sm text-contrast-white/50'>
        {value != null ? value : 'in development'}
      </PopoverTrigger>
      <PopoverContent>
        {value != null
          ? `Verified Uptime: ${value}`
          : 'We are developing this feature at the moment.'}
      </PopoverContent>
    </PopoverTooltip>
  );
}
