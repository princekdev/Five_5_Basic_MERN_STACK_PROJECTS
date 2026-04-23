/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#ede9e0',
          200: '#d9d2c4',
          300: '#bfb49e',
          400: '#a29478',
          500: '#8a7a60',
          600: '#726350',
          700: '#5c4f41',
          800: '#4d4237',
          900: '#42382f',
          950: '#231e19',
        },
        parchment: '#faf8f4',
        cream: '#f5f0e8',
        accent: '#c4622d',
        'accent-light': '#e8815a', 
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: '"DM Sans", system-ui, sans-serif',
          },
        },
      },
    },
  },
  plugins: [],
};
