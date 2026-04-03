/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color tokens from PRD
        navy: {
          900: '#0A1628',
          800: '#0F1F3A',
          700: '#1A2B4A',
        },
        teal: {
          500: '#14B8A6',
          400: '#2DD4BF',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          700: '#334155',
          800: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        // Custom spacing tokens
        18: '4.5rem',
        88: '22rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
