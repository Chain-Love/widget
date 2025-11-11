'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '../shadcn/button';
import { useQueryConfig } from '@/service/configApi';

export default function ErrorState({ message }: { message?: string }) {
  const { config: appConfig } = useQueryConfig();

  console.error('Errormessage:', message);

  const normalized = (message || '').toLowerCase().trim();
  const isMissingNetwork =
    normalized === 'missing network parameter' ||
    normalized.includes('missing network parameter');

  const supportedNetworks = Object.keys(appConfig?.dataSources || {}).sort();

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');
  const baseUrl = isLocalhost
    ? 'http://localhost:3000'
    : 'https://widget.docs.chain.love';

  const exampleUrl = `${baseUrl}/?network=filecoin`;

  if (isMissingNetwork) {
    return (
      <div className='mb-2 flex h-auto flex-col items-center justify-center gap-3 rounded-md border p-6 text-destructive'>
        <AlertTriangle size={32} />
        <p className='text-center text-sm'>
          <strong>Missing required parameter:</strong> <code>network</code>
          <br />
          Please add it to your widget URL.
        </p>

        <p className='text-center text-xs text-gray-11'>
          Example:&nbsp;
          <a
            href={exampleUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-gray-12'
          >
            {exampleUrl}
          </a>
        </p>

        <div className='mt-4 w-full max-w-sm rounded-md bg-gray-3 p-3 text-center text-xs text-gray-11'>
          <p className='mb-2 font-medium text-gray-12'>Supported networks:</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {supportedNetworks.map(net => (
              <span
                key={net}
                className='rounded-md bg-gray-4 px-2 py-1 font-mono text-[11px] text-gray-12'
              >
                {net}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mb-2 flex h-96 flex-col items-center justify-center gap-2 rounded-md border text-destructive'>
      <AlertTriangle size={32} />
      <p className='text-center text-sm'>
        An error occurred while loading the data.
        <br />
        Please try again later.
      </p>
      <Button
        variant='outline'
        size='sm'
        onClick={() => window.location.reload()}
      >
        <RefreshCcw className='mr-2 size-4' />
        Reload page
      </Button>
      <p className='max-w-xs text-center text-xs text-gray-11'>
        <br />
        {`If reloading doesn't help, try a`} <strong>hard refresh</strong>{' '}
        <em>(with cache clearing)</em>:
        <br />
        <span>Cmd + Shift + R</span> (Mac) or <span>Ctrl + Shift + R</span>{' '}
        (Windows).
        <br />
        If the problem still occurs, please contact support.
      </p>
    </div>
  );
}
