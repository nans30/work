/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        mockup: {
          bg: '#F4F5F8',
          card: '#FFFFFF',
          dark: '#0F172A',
          subtext: '#94A3B8',
          border: '#F1F5F9',
          'blue-deep': '#1E3A8A',
          'purple-deep': '#312E81',
          'purple-vibrant': '#7C3AED',
          'blue-vibrant': '#2563EB',
          'emerald-pill': '#10B981',
          'emerald-bg': '#ECFDF5',
          'rose-pill': '#EF4444',
          'rose-bg': '#FEF2F2',
        },
      },
      boxShadow: {
        'mockup': '0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'mockup-lg': '0 12px 30px -4px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
        'floating': '0 20px 45px -10px rgba(15, 23, 42, 0.10), 0 4px 15px -3px rgba(15, 23, 42, 0.05)',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top, 16px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 24px)',
      }
    },
  },
  plugins: [],
}
