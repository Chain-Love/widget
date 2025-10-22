// eslint-disable-next-line @typescript-eslint/no-require-imports
const animate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        lg: '32px',
        '2xl': '48px',
      },
    },
    colors: {
      // 1-2 - background
      // 3-5 - interactive components
      // 6-8 - borders and separators
      // 9-10 - solid colors
      // 11-12 - text
      gray: {
        1: 'hsl(var(--gray-1))',
        2: 'hsl(var(--gray-2))',
        3: 'hsl(var(--gray-3))',
        4: 'hsl(var(--gray-4))',
        5: 'hsl(var(--gray-5))',
        6: 'hsl(var(--gray-6))',
        7: 'hsl(var(--gray-7))',
        8: 'hsl(var(--gray-8))',
        9: 'hsl(var(--gray-9))',
        10: 'hsl(var(--gray-10))',
        11: 'hsl(var(--gray-11))',
        12: 'hsl(var(--gray-12))',
      },
      sand: {
        1: 'hsl(var(--sand-1))',
        2: 'hsl(var(--sand-2))',
        3: 'hsl(var(--sand-3))',
        4: 'hsl(var(--sand-4))',
        5: 'hsl(var(--sand-5))',
        6: 'hsl(var(--sand-6))',
        7: 'hsl(var(--sand-7))',
        8: 'hsl(var(--sand-8))',
        9: 'hsl(var(--sand-9))',
        10: 'hsl(var(--sand-10))',
        11: 'hsl(var(--sand-11))',
        12: 'hsl(var(--sand-12))',
      },
      accent: {
        1: 'hsl(var(--accent-1))',
        2: 'hsl(var(--accent-2))',
        3: 'hsl(var(--accent-3))',
        4: 'hsl(var(--accent-4))',
        5: 'hsl(var(--accent-5))',
        6: 'hsl(var(--accent-6))',
        7: 'hsl(var(--accent-7))',
        8: 'hsl(var(--accent-8))',
        9: 'hsl(var(--accent-9))',
        10: 'hsl(var(--accent-10))',
        11: 'hsl(var(--accent-11))',
        12: 'hsl(var(--accent-12))',
      },

      // plans
      bronze: 'hsl(22, 91%, 54%)',
      silver: 'hsl(215, 19%, 61%)',
      gold: 'hsl(42, 100%, 62%)',
      // plans

      contrast: {
        white: 'hsl(var(--white-contrast))',
        black: 'hsl(var(--black-contrast))',
      },
      transparent: 'transparent',
      current: 'currentColor',
      black: 'hsl(0 0% 0%)',
      white: 'hsl(0 0% 100%)',

      // State colors
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        soft: 'hsl(0 94% 87%)',
      },
      warning: {
        DEFAULT: 'hsl(var(--warning))',
        soft: 'hsl(60 94% 87%)',
      },
      success: {
        DEFAULT: 'hsl(var(--success))',
        soft: 'hsl(132 94% 87%)',
      },
      info: {
        DEFAULT: 'hsl(var(--info))',
        soft: 'hsl(200 94% 87%)',
      },
    },

    extend: {
      fontFamily: {
        DEFAULT: ['var(--font-manrope)'],
      },

      screens: {
        xs: '480px',
        sm: '640px', // already in the container
        md: '780px', // already in the container
        lg: '1024px', // already in the container
        xl: '1280px', //  already in the container
        '2xl': '1440px',
        '3xl': '1920px',
      },

      borderRadius: { sm: '4px' },
      backgroundImage: {
        'gradient-accent':
          'linear-gradient(250deg, #f7a502 0%, #f54c03 50%, #f7a502 100%)',
        'gradient-foreground-accent':
          'linear-gradient(91deg, #F76B15 -96.37%, #FFDC91 112.35%)',
        'gradient-primary':
          'conic-gradient(from 180deg at 50% 50%, #085638 0deg, #02C67B 360deg)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  plugins: [animate],
};
