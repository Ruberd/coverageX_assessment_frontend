/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 10px 30px rgba(2, 6, 23, 0.15)'
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}


