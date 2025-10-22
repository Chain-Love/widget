'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

/** 
<PopoverTooltip>
  <PopoverTrigger className='group'>
    <InfoIcon
      width={15}
      height={15}
      className='transition-colors hover:text-success group-data-[state=open]:text-success'
    />
  </PopoverTrigger>

  <PopoverContent></PopoverContent>
</PopoverTooltip>
*/

const PopoverTooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  const [fixedOpen, setFixedOpen] = React.useState(false);

  const showTimer = React.useRef<NodeJS.Timeout | null>(null);
  const hideTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleOutsideClick = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      setFixedOpen(p => !p);
    } else if (!fixedOpen || !open) {
      setFixedOpen(true);
    } else if (fixedOpen && !open && !isOpen) {
      setFixedOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    showTimer.current = setTimeout(() => setOpen(true), 100);
  };

  const handleMouseLeave = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = setTimeout(() => setOpen(false), 100);
  };

  return (
    <PopoverPrimitive.Root
      open={fixedOpen || open}
      onOpenChange={handleOutsideClick}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              ...(child.props && {
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
              }),
            })
          : child,
      )}
    </PopoverPrimitive.Root>
  );
};

const Popover = PopoverPrimitive.Popover;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 3,
      children,
      side = 'top',
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        arrowPadding={30}
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          'pointer-events-auto z-50 w-max max-w-80 rounded-md border bg-gray-2 px-2 py-1 text-sm shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      >
        {children}

        <PopoverPrimitive.Arrow
          stroke='hsl(var(--border))'
          strokeWidth={1.5}
          fill='hsl(var(--border))'
        />
        <div className='absolute left-0 top-full z-[51] h-2 w-full' />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {
  PopoverTooltip,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  Popover,
};
