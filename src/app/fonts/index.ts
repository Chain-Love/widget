import localFont from 'next/font/local';

export const inter = localFont({
  src: './Inter/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-body',
});

export const manrope = localFont({
  src: [
    {
      path: './Manrope/Manrope-ExtraLight.ttf',
      weight: '200',
    },
    {
      path: './Manrope/Manrope-Light.ttf',
      weight: '300',
    },
    {
      path: './Manrope/Manrope-Regular.ttf',
      weight: '400',
    },
    {
      path: './Manrope/Manrope-Medium.ttf',
      weight: '500',
    },
    {
      path: './Manrope/Manrope-SemiBold.ttf',
      weight: '600',
    },
    {
      path: './Manrope/Manrope-Bold.ttf',
      weight: '700',
    },
    {
      path: './Manrope/Manrope-ExtraBold.ttf',
      weight: '800',
    },
  ],
  variable: '--font-manrope',
});
