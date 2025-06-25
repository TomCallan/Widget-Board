/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          100: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 20%))',
          200: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 15%))',
          300: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 10%))',
          400: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 5%))',
          500: 'hsl(var(--accent-h), var(--accent-s), var(--accent-l))',
          600: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) - 5%))',
          700: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) - 10%))',
          800: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) - 15%))',
          900: 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) - 20%))',
        },
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
};
