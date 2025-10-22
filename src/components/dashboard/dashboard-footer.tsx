import Link from 'next/link';

export default function DashboardFooter() {
  return (
    <div className='mt-4 flex items-center justify-center gap-6 text-sm font-medium text-accent-12 underline md:text-base'>
      <Link
        href='https://www.chain.love/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Contact us
      </Link>
      <Link
        href='https://protofire-org.gitbook.io/chain-love-docs/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Documentation
      </Link>
    </div>
  );
}
