/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#04050a',
          900: '#0a0a0f',
          800: '#0f1019',
          700: '#161825',
          600: '#1e2035',
          500: '#282a42',
          400: '#3a3d5c',
          300: '#5a5f8a',
          200: '#8389b8',
          100: '#b0b5d9',
        },
        neon: {
          green: '#39ff14',
          'green-dim': '#1a8a0a',
          blue: '#00d4ff',
          purple: '#bc13fe',
          red: '#ff1744',
          orange: '#ff9100',
          yellow: '#ffea00',
        },
      },
      animation: {
        'pulse-fast': 'pulse 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'glow': 'glow 2s ease-in-out infinite',
        'wave': 'wave 0.6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px) scale(0.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(57,255,20,0.3), 0 0 60px rgba(57,255,20,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(57,255,20,0.6), 0 0 120px rgba(57,255,20,0.2)' },
        },
        wave: {
          '0%,100%': { height: '4px' },
          '50%': { height: '24px' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.8' },
          '50%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(0.85)', opacity: '0' },
        },
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(57,255,20,0.4)',
        'neon-green-lg': '0 0 40px rgba(57,255,20,0.5), 0 0 80px rgba(57,255,20,0.2)',
        'neon-blue': '0 0 20px rgba(0,212,255,0.4)',
        'neon-red': '0 0 20px rgba(255,23,68,0.4)',
      },
    },
  },
  plugins: [],
}
