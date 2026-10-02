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
        pastel: {
          blue: {
            DEFAULT: '#DDF4FF',
            text: '#0284C7',
            dark: '#1E3A8A',
            badge: '#BAE6FD',
          },
          green: {
            DEFAULT: '#DCFCE7',
            text: '#16A34A',
            dark: '#14532D',
            badge: '#BBF7D0',
          },
          purple: {
            DEFAULT: '#F3E8FF',
            text: '#9333EA',
            dark: '#581C87',
            badge: '#E9D5FF',
          },
          orange: {
            DEFAULT: '#FFEDD5',
            text: '#EA580C',
            dark: '#7C2D12',
            badge: '#FED7AA',
          },
          pink: {
            DEFAULT: '#FCE7F3',
            text: '#DB2777',
            dark: '#831843',
            badge: '#FBCFE8',
          },
        },
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'soft-lg': '0 14px 40px rgba(0, 0, 0, 0.2)',
        'pastel-purple': '0 10px 25px -5px rgba(147, 51, 234, 0.25)',
        'pastel-blue': '0 10px 25px -5px rgba(2, 132, 199, 0.25)',
        'pastel-green': '0 10px 25px -5px rgba(22, 163, 74, 0.25)',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top, 16px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 20px)',
      }
    },
  },
  plugins: [],
}
