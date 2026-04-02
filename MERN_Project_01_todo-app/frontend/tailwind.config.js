/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f3f0',
          100: '#e8e4de',
          200: '#d1c9be',
          300: '#b5a898',
          400: '#9a8878',
          500: '#847060',
          600: '#6e5c4f',
          700: '#5a4a40',
          800: '#483b33',
          900: '#3a2f29',
          950: '#1e1812',
        },
        cream: '#faf8f4',
        parchment: '#f0ece4',
        ember: '#e85d26',
        sage: '#5a7a5a',
        dust: '#c4b8a8',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(58, 47, 41, 0.08), 0 4px 12px rgba(58, 47, 41, 0.05)',
        'paper-lg': '0 2px 8px rgba(58, 47, 41, 0.10), 0 12px 32px rgba(58, 47, 41, 0.08)',
        'ember': '0 0 0 3px rgba(232, 93, 38, 0.15)',
      },
    },
  },
  plugins: [],
};
