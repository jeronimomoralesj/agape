import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cielo: {
          50: '#F4FAFF',
          100: '#E0F2FE', // Primary — soft sky blue backdrop
          200: '#BAE2FB',
          300: '#8CCDF6',
        },
        royal: {
          DEFAULT: '#1E3A8A', // Deep spiritual royal blue
          deep: '#16306F',
          night: '#0E2152',
          ink: '#091740',
        },
        oro: {
          DEFAULT: '#D4AF37', // Radiant metallic gold
          light: '#E8CD6F',
          pale: '#F6E9C2',
          deep: '#A8862A',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        logo: ['var(--font-logo)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        aura: '0 0 24px 2px rgba(212, 175, 55, 0.35)',
        'aura-soft': '0 0 40px 4px rgba(212, 175, 55, 0.18)',
        luxe: '0 24px 60px -24px rgba(14, 33, 82, 0.25)',
        card: '0 10px 40px -12px rgba(30, 58, 138, 0.12)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(105deg, transparent 40%, rgba(255, 240, 200, 0.55) 50%, transparent 60%)',
        'royal-radial':
          'radial-gradient(ellipse at top, #1E3A8A 0%, #0E2152 60%, #091740 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'cart-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.35)' },
          '60%': { transform: 'scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'cart-bounce': 'cart-bounce 0.6s ease-in-out',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
