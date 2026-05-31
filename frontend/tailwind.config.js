/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fef5f2',
          100: '#fde9df',
          200: '#fbd3be',
          300: '#f9b79e',
          400: '#e07b54',
          500: '#c4622d',
          600: '#a35023',
          700: '#85411c',
          800: '#6a3515',
          900: '#3d1f0f',
        },
        cream: {
          100: '#faf7f2',
          200: '#f5efe6',
          300: '#ecddd0',
          400: '#dfc9b6',
        },
        gold: {
          400: '#d4a857',
          500: '#c9a84c',
          600: '#b8962e',
        },
        stone: {
          200: '#e5ddd5',
          500: '#8a7567',
          700: '#4a3728',
          900: '#1a0f07',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'warm': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'warm-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
