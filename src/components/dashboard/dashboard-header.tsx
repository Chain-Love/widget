import Image from 'next/image';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { MessageCircle } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className='mb-4 flex items-center justify-between text-xs xs:text-sm md:text-base'>
      <span className='flex items-center gap-[4px] text-accent-12'>
        Powered by
        <a
          className='inline-flex items-center hover:underline'
          href={'https://www.chain.love/'}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            src='/chain-love-logo.svg'
            alt='chain.love'
            width={10}
            height={10}
            className='size-6'
          />
          <span className='font-bold'>CHAIN</span>.LOVE
        </a>
      </span>
      <Link
        href='https://chatgpt.com/g/g-68bf52c0b60c8191a56c6f98959b97ec-chain-love'
        target='_blank'
        rel='noopener noreferrer'
        className='flex h-6 items-center gap-1 rounded-sm bg-accent-9 px-1 text-sm text-white transition-colors duration-100 hover:bg-accent-10 xs:h-8 xs:gap-2 xs:px-3'
      >
        <ImageWithFallback
          primary={{
            filename: 'chat-gpt.svg',
          }}
          fallback={{
            lucide: MessageCircle,
          }}
          alt='Chat GPT'
          className='size-4 invert'
        />
        <p className='mr-3'>Ask Chat GPT</p>
      </Link>
    </div>
  );
}
