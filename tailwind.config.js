/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          like: 'var(--color-accent-like)',
          nope: 'var(--color-accent-nope)',
          star: 'var(--color-accent-star)',
          surface: {
            950: 'var(--color-surface-950)',
            800: 'var(--color-surface-800)',
            700: 'var(--color-surface-700)',
          }
        }
      }
    },
  },
  plugins: [],
}
