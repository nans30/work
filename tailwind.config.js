/** @type {import('tailwindcss').Config} */
export default {
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
        theme: {
          bg: '#F8F9FC',
          card: '#FFFFFF',
          dark: '#0F172A',
          subtext: '#64748B',
          border: '#F1F5F9',
          'border-subtle': '#E2E8F0',
        },
        brand: {
          blue: '#1D4ED8',
          indigo: '#4338CA',
          purple: '#7C3AED',
          emerald: '#10B981',
          'emerald-bg': '#ECFDF5',
          rose: '#EF4444',
          'rose-bg': '#FEF2F2',
        },
      },
      boxShadow: {
        'mockup': '0 8px 24px -4px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'mockup-lg': '0 16px 36px -6px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'floating': '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 4px 15px -3px rgba(15, 23, 42, 0.06)',
        'glow-purple': '0 10px 30px -5px rgba(124, 58, 237, 0.3)',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top, 16px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 24px)',
      }
    },
  },
  plugins: [],
}
