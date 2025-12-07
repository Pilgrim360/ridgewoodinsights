import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006466',
          dark: '#004d4f', // 10% darker
        },
        secondary: '#2C3E50',
        text: '#415161',
        surface: '#E2E7ED',
        background: '#F8F9FB',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
};

export default config;