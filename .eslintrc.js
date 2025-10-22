// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require('./tailwind.config.js');

module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:tailwindcss/recommended',
  ],

  settings: {
    tailwindcss: {
      callees: ['classnames', 'clsx', 'ctl', 'cn', 'cva'],
      config,
    },
  },
  plugins: ['tailwindcss'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-var': 'warn',
    '@typescript-eslint/no-namespace': 'warn',
    '@typescript-eslint/no-empty-object-type': 'warn',
    'tailwindcss/migration-from-tailwind-2': 'off',
  },
};
