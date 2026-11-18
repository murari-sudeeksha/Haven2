/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07080d', // Ultra deep void black
          900: '#0b0d16', // Deep charcoal base
          850: '#0f121d', // Card surface
          800: '#141825', // Surface elevated
          750: '#1a2032', // Hover surface
          700: '#232b42', // Border dark
          600: '#323c5b',
          500: '#4a5780',
        },
        navy: {
          950: '#070e1e',
          900: '#0c182e',
          850: '#10203d',
          800: '#162a4f',
          700: '#1e3869',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        purple: {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        haven: {
          teal: '#0d9488',
          tealLight: '#14b8a6',
          cyan: '#06b6d4',
          purple: '#a855f7',
          violet: '#8b5cf6',
          accent: '#2dd4bf',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.45)',
        'glow-purple': '0 0 25px -4px rgba(168, 85, 247, 0.45)',
        'glow-multi': '0 0 35px -5px rgba(6, 182, 212, 0.3), 0 0 35px -5px rgba(168, 85, 247, 0.3)',
        'glow-subtle': '0 0 20px 0 rgba(6, 182, 212, 0.15)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'card-dark-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px -5px rgba(6, 182, 212, 0.25), 0 0 1px 1px rgba(6, 182, 212, 0.4)',
      }
    },
  },
  plugins: [],
}
