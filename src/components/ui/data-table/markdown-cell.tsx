'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '../shadcn/badge';

export function MarkdownCell({
  value,
  className,
}: {
  value: unknown;
  className?: string;
}) {
  const baseCellClass = cn(
    'grid h-full w-fit max-w-60 items-center overflow-auto text-wrap text-sm leading-none',
    className,
  );

  // Boolean -> 'Yes'/'No'
  if (typeof value === 'boolean') {
    return <Badge variant={'secondary'}>{value ? 'Yes' : 'No'}</Badge>;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className={baseCellClass}>—</p>;
    }

    const allStrings = value.every(v => typeof v === 'string');
    if (allStrings) {
      // If the array contains only strings:
      // join them with commas so that Markdown can render links or text properly
      const joined = (value as string[]).join(', ');
      return (
        <div className={baseCellClass}>
          <ReactMarkdown
            components={{
              a: ({ ...props }) => (
                <a
                  {...props}
                  className='text-info underline hover:text-info-soft'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
              p: ({ ...props }) => <span {...props} />,
            }}
          >
            {joined}
          </ReactMarkdown>
        </div>
      );
    } else {
      // If the array contains non-string values: just stringify the whole array
      return <p className={baseCellClass}>{JSON.stringify(value)}</p>;
    }
  }

  // Handle string values: render with Markdown support
  if (typeof value === 'string') {
    return (
      <div className={baseCellClass}>
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a
                {...props}
                className='text-info underline hover:text-info-soft'
                target='_blank'
                rel='noopener noreferrer'
              />
            ),
            p: ({ ...props }) => <Badge {...props} />,
          }}
        >
          {value}
        </ReactMarkdown>
      </div>
    );
  }

  // Handle numbers, bigint, null, undefined, or other non-array objects
  return (
    <p className={baseCellClass}>
      {value === null || value === undefined ? '—' : String(value)}
    </p>
  );
}
