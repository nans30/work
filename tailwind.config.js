/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top, 16px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 20px)',
      }
    },
  },
  plugins: [],
}
