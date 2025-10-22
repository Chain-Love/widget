import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function PageLoading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-1/80 backdrop-blur-sm'>
      <LoadingSpinner size={66} />
    </div>
  );
}
