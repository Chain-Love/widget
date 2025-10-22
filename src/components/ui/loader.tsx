import { RotatingLines } from 'react-loader-spinner';

interface LoaderProps {
  size?: string;
  color?: string;
}

export function Loader({ size = '24px', color = 'grey' }: LoaderProps) {
  return (
    <RotatingLines
      visible={true}
      width={size}
      strokeColor={color}
      strokeWidth='5'
      animationDuration='0.75'
      ariaLabel='rotating-lines-loading'
    />
  );
}
