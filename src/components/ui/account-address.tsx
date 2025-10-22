'use client';

import CopyToClipboardButton from '@/components/ui/buttons/copy-button';

import { InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PopoverTooltip,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover';

interface AccountAddress extends React.HTMLAttributes<HTMLDivElement> {
  accountAddress: string;
  tooltipText?: string;
  maxAddressLength?: number;
  copyButton?: boolean;
}

export default function AccountAddress({
  accountAddress,

  tooltipText,
  maxAddressLength = 160,
  className,
  copyButton = true,
}: AccountAddress) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {tooltipText && (
        <PopoverTooltip>
          <PopoverTrigger>
            <InfoIcon />
          </PopoverTrigger>

          <PopoverContent>{tooltipText}</PopoverContent>
        </PopoverTooltip>
      )}

      <PopoverTooltip>
        <PopoverTrigger>
          <div style={{ maxWidth: maxAddressLength }} className='flex'>
            <div className='max-w-40 truncate'>
              {accountAddress.slice(0, accountAddress.length - 4)}
            </div>
            {accountAddress.slice(-4)}
          </div>
        </PopoverTrigger>

        {accountAddress.length > maxAddressLength && (
          <PopoverContent className='p-3'>{accountAddress}</PopoverContent>
        )}
      </PopoverTooltip>

      {copyButton && (
        <CopyToClipboardButton className='z-50' copyText={accountAddress} />
      )}
    </div>
  );
}
