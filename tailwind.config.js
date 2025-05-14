/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fc',
          100: '#cce0f9',
          200: '#99c2f3',
          300: '#66a3ed',
          400: '#3385e7',
          500: '#0062cc',
          600: '#004fa3',
          700: '#003b7a',
          800: '#002852',
          900: '#001429',
        },
        secondary: {
          50: '#fff8eb',
          100: '#fff1d7',
          200: '#ffe3af',
          300: '#ffd587',
          400: '#ffc65f',
          500: '#ffb74d',
          600: '#cc923e',
          700: '#996e2e',
          800: '#66491f',
          900: '#33250f',
        },
        accent: {
          50: '#e6f7f9',
          100: '#cceff2',
          200: '#99dfe6',
          300: '#66cfd9',
          400: '#33bfcc',
          500: '#00acc1',
          600: '#008a9a',
          700: '#006773',
          800: '#00454d',
          900: '#002226',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};