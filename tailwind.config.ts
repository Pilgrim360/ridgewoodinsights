import type { Config } from 'tailwindcss';
import type { PluginUtils } from 'tailwindcss/types/config';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '5rem',
      },
    },
    extend: {
      spacing: {
        'fluid-4': 'clamp(1rem, 0.95rem + 0.25vw, 1.5rem)',
        'fluid-6': 'clamp(1.5rem, 1.35rem + 0.6vw, 2.25rem)',
        'fluid-8': 'clamp(2rem, 1.8rem + 0.9vw, 3rem)',
      },
      colors: {
        primary: {
          DEFAULT: '#006466',
          dark: '#004d4f',
        },
        secondary: '#2C3E50',
        text: '#415161',
        surface: '#E2E7ED',
        'table-border': '#6B7C8D',
        background: '#F8F9FB',
        white: '#FFFFFF',
      },
      typography: ({ theme }: PluginUtils) => ({
        DEFAULT: {
          css: {
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              overflow: 'hidden',
            },
            'th, td': {
              border: `1px solid ${theme('colors.table-border')}`,
              padding: '0.5rem',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
