import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(timeout = 3000): [CopyFn, boolean] {
  const [isCopied, setIsCopied] = useState(false);

  const copy: CopyFn = useCallback(
    async text => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
        return true;
      } catch (e) {
        console.error('Copy failed:', e);
        setIsCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return [copy, isCopied];
}

interface CopyToClipboardButtonProps
  extends React.HTMLProps<HTMLButtonElement> {
  copyText: string;
  copyButton?: boolean;
  tooltipText?: string;
}

export default function CopyToClipboardButton({
  copyText,
  className,
  children,
  disabled,
  tooltipText = 'Copied!',
  copyButton = true,
}: CopyToClipboardButtonProps) {
  const [copy, isCopied] = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copy(copyText);
    if (success) toast.success(tooltipText);
    else toast.error('Copy failed');
  };

  return (
    <button
      className={cn('flex h-auto gap-1 p-0', className)}
      disabled={isCopied || disabled}
      onClick={handleCopy}
      aria-label='Copy to clipboard'
    >
      {children}
      {copyButton && (
        <div className='size-5'>
          {isCopied ? (
            <CheckIcon className='size-full text-success' />
          ) : (
            <CopyIcon className='size-full text-gray-11 transition-colors hover:text-contrast-white' />
          )}
        </div>
      )}
    </button>
  );
}
