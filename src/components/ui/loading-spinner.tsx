import { cn } from '@/lib/utils';
import { Loader, LoaderCircle, LoaderPinwheel } from 'lucide-react';

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  title?: string;
  type?: 'loader' | 'loader-circle' | 'loader-pinwheel';
}

export const LoadingSpinner = ({
  size = 24,
  className,
  title,
  ...props
}: ISVGProps) => {
  const LoaderComponent = {
    loader: Loader,
    'loader-circle': LoaderCircle,
    'loader-pinwheel': LoaderPinwheel,
  }[props.type ?? 'loader'];

  return (
    <div className='flex gap-2'>
      {title && <p>{title}</p>}
      <LoaderComponent
        size={size}
        className={cn('animate-spin', className)}
        {...props}
      />
    </div>
  );
};
