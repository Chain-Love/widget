import { CategoryEntityMap } from '@/service/infrastructureProvidersApi/types';
import { CellProps } from '../../categories';
import {
  PopoverContent,
  PopoverTooltip,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';

export default function VerifiedLatency({}: CellProps<
  CategoryEntityMap['rpc']
>) {
  return (
    <PopoverTooltip>
      <PopoverTrigger className='text-sm text-contrast-white/50'>
        in development
      </PopoverTrigger>
      <PopoverContent>
        we are developing this feature at the moment
      </PopoverContent>
    </PopoverTooltip>
  );
}
