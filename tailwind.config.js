/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          bg: '#04110B',
          surface: '#0B2519',
          primary: '#10B981',
          secondary: '#84CC16',
          text: '#F0FDF4',
          alert: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(16, 185, 129, 0.3)',
        'glow-alert': '0 0 20px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
