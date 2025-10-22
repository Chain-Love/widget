import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '../shadcn/button';

export default function ErrorState({ message }: { message?: string }) {
  console.error('Errormessage:', message);
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
