/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   '#ffffff',
        secondary: '#a3a3a3',
        accent:    '#3b82f6',
        bg:        '#050505',
        surface:   '#111111',
        'surface-2': '#1a1a1a',
        muted:     '#737373',
        border:    '#262626',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary':  'linear-gradient(135deg, #ffffff 0%, #a3a3a3 100%)',
        'gradient-accent':   'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'gradient-surface':  'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
      },
      animation: {
        'pulse-glow':      'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
      },
      boxShadow: {
        'card':         '0 4px 24px rgba(0,0,0,0.8)',
        'card-hover':   '0 8px 32px rgba(255,255,255,0.05)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.03)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
