import { Button } from '@/components/ui/shadcn/button';
import { ExternalLink, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CellContext } from '@tanstack/react-table';

function isExternal(url: string) {
  return /^https:\/\/[^\s]+$/i.test(url); // only https
}

function isInternal(url: string) {
  return /^\/(?!\/)/.test(url); // only /...
}

type ParsedLink = { label: string; url: string; type: string };

// Matches exactly ONE markdown-style link: [label](url)
const singleLinkRE = /^\[(?!\[)([^\]]+)\]\(([^)]+)\)$/;

export default function ActionButton({
  actionButtons,
  className,
  buttonClassName,
}: {
  actionButtons: string[] | null;
  className?: string;
  buttonClassName?: string;
  ctx?: CellContext<any, unknown>;
}) {
  const links = (actionButtons ?? [])
    .map<ParsedLink | null>(s => {
      const m = (typeof s === 'string' ? s.trim() : '').match(singleLinkRE);
      if (!m) return null;
      const label = m[1].trim();
      const url = m[2].trim();
      if (!(isExternal(url) || isInternal(url))) return null;
      const type = isExternal(url) ? 'external' : 'internal';
      return { label, url, type };
    })
    .filter((x): x is ParsedLink => !!x);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center gap-2 p-2',
        className,
      )}
    >
      {links.map(({ label, url, type }, index) => {
        const isExternal = type === 'external';
        const isSecondElement = index === 1;
        return (
          <Button
            key={label + url}
            size='sm'
            variant={'accent'}
            className={cn(
              'h-8 rounded-md px-3 text-sm opacity-90 hover:opacity-100',
              buttonClassName,
            )}
            asChild
          >
            <Link
              href={url}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={cn(isSecondElement && 'bg-gray-9 hover:bg-gray-10')}
            >
              <span className='flex items-center gap-1'>
                {isExternal ? <ExternalLink size={14} /> : <Link2 size={14} />}
                {label}
              </span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
