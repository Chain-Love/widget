'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      visibleToasts={5}
      richColors
      position='bottom-right'
      theme={theme as ToasterProps['theme']}
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className='toaster group'
      toastOptions={{
        closeButton: true,

        classNames: {
          toast:
            'group toast group-[.toaster]:text-contrast-white group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto',
          description: 'group-[.toast]:text-gray-11',
          actionButton: 'group-[.toast]:bg-gray-12 group-[.toast]:text-gray-2',
          cancelButton: 'group-[.toast]:bg-gray-4 group-[.toast]:text-gray-11',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
