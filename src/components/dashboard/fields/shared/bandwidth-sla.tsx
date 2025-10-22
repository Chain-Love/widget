import { CellProps } from '../../categories';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';

export default function BandwidthSla({ ctx }: CellProps<any>) {
  const value = ctx.row.original.bandwidthSla;

  return (
    <PopoverTooltip>
      <PopoverTrigger className='text-sm text-contrast-white/50'>
        {value ? value : 'in development'}
      </PopoverTrigger>
      <PopoverContent>
        {value
          ? `Bandwidth SLA: ${value}`
          : 'We are developing this feature at the moment.'}
      </PopoverContent>
    </PopoverTooltip>
  );
}
