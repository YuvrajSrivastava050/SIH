import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#04070F',
        'bg-secondary':  '#080D1A',
        'bg-card':       'rgba(255,255,255,0.035)',
        saffron:         '#FF6B00',
        'saffron-light': '#FF8C00',
        forensic:        '#4FFFB0',
        danger:          '#FF3B5C',
        caution:         '#FFD60A',
        'text-primary':  '#F0F4FF',
        'text-secondary':'#A8B3CF',
        'text-muted':    '#4B5568',
        'border-subtle': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        body:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'saffron-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FFD60A 100%)',
        'forensic-gradient':'linear-gradient(135deg, #4FFFB0 0%, #3B82F6 100%)',
        'dark-gradient':    'linear-gradient(180deg, #04070F 0%, #080D1A 100%)',
      },
      boxShadow: {
        'saffron':  '0 0 24px rgba(255,107,0,0.25), 0 0 48px rgba(255,107,0,0.1)',
        'green':    '0 0 24px rgba(79,255,176,0.2), 0 0 48px rgba(79,255,176,0.08)',
        'danger':   '0 0 24px rgba(255,59,92,0.25), 0 0 48px rgba(255,59,92,0.08)',
        'card':     '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
        'card-hover':'0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
      },
      animation: {
        'fade-in':        'fadeIn 0.4s ease-out forwards',
        'slide-up':       'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-saffron':  'pulseSaffron 2s ease-in-out infinite',
        'pulse-danger':   'pulseDanger 1.5s ease-in-out infinite',
        'shimmer':        'shimmer 3s linear infinite',
        'glow-pulse':     'glowPulse 3s ease-in-out infinite',
        'float':          'float 6s ease-in-out infinite',
        'spin-slow':      'spin 8s linear infinite',
        'ticker':         'ticker 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSaffron: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,107,0,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(255,107,0,0)' },
        },
        pulseDanger: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,59,92,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(255,59,92,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}

export default config
