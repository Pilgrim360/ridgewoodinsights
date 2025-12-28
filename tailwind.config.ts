import type { Config } from 'tailwindcss';
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
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '3rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006466',
          dark: '#004d4f',
        },
        secondary: '#2C3E50',
        text: '#415161',
        surface: '#E2E7ED',
        background: '#F8F9FB',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [typography],
};

export default config;
