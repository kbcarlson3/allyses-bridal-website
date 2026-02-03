/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Editorial Color System
        editorial: {
          black: '#0A0A0A',
          charcoal: '#1A1A1A',
          graphite: '#2C2C2C',
          stone: '#4A4A4A',
          pearl: '#F8F7F5',
          ivory: '#FDFBF7',
          cream: '#F5F2ED',
          champagne: '#F0EBE3',
        },
        gold: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#EFCF5D',
          500: '#D4AF37', // Primary champagne gold
          600: '#B8962E',
          700: '#9C7D25',
          800: '#80641D',
          900: '#644B14',
        },
        // Keep legacy bridal colors for backward compatibility
        bridal: {
          ivory: '#FDFBF7',
          cream: '#F5F2ED',
          taupe: '#E8E3DD',
          charcoal: '#2C2C2C',
          clay: {
            50: '#FAF6F3',
            100: '#F4EDE7',
            200: '#E9DBCF',
            300: '#DEC9B7',
            400: '#D3B79F',
            500: '#C9A58B',
            600: '#B8927A',
            700: '#9A7860',
            800: '#735A48',
            900: '#4D3C30',
          },
          charcoal: {
            50: '#F7F7F7',
            100: '#E8E8E8',
            200: '#D1D1D1',
            300: '#B9B9B9',
            400: '#727272',
            500: '#2C2C2C',
            600: '#242424',
            700: '#1E1E1E',
            800: '#171717',
            900: '#0F0F0F',
          },
        },
      },
      fontFamily: {
        // Editorial Typography System
        display: ['Playfair Display', 'Bodoni Moda', 'Cormorant Garamond', 'serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Manrope', 'Inter', 'sans-serif'],
        body: ['Manrope', 'Inter', 'sans-serif'],
        editorial: ['Playfair Display', 'serif'],
        accent: ['Bodoni Moda', 'serif'],
      },
      fontSize: {
        // Dramatic Editorial Scale
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.05em' }], // 10px
        'xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.05em' }], // 11px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }], // 36px
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 60px
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 72px
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }], // 96px
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.03em' }], // 128px
        'display': ['7.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }], // 120px
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        snug: '-0.01em',
        normal: '0',
        wide: '0.05em',
        wider: '0.1em',
        widest: '0.15em',
        editorial: '0.15em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
      },
      boxShadow: {
        // Luxury Editorial Shadows
        'luxury': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'luxury-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
        'luxury-xl': '0 16px 64px rgba(0, 0, 0, 0.16)',
        'gold': '0 4px 24px rgba(212, 175, 55, 0.15)',
        'gold-glow': '0 0 32px rgba(212, 175, 55, 0.3)',
        'inner-luxury': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'luxury': '20px',
      },
      borderRadius: {
        'luxury': '2px',
      },
      aspectRatio: {
        'editorial': '3 / 4',
        'cinematic': '16 / 9',
        'portrait': '2 / 3',
        'square': '1 / 1',
      },
      animation: {
        // Editorial Animations
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-slow': 'fadeIn 1.2s ease-out',
        'slide-up': 'slideUp 1s ease-out',
        'slide-up-slow': 'slideUp 1.4s ease-out',
        'slide-in-right': 'slideInRight 1s ease-out',
        'slide-in-left': 'slideInLeft 1s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'scale-in-rotate': 'scaleInRotate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'reveal-up': 'revealUp 1s ease-out',
        'reveal-mask': 'revealMask 1.2s ease-out',
        'gold-shimmer': 'goldShimmer 2.5s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',

        // Stagger delays
        'fade-in-d1': 'fadeIn 0.8s ease-out 0.1s both',
        'fade-in-d2': 'fadeIn 0.8s ease-out 0.2s both',
        'fade-in-d3': 'fadeIn 0.8s ease-out 0.3s both',
        'fade-in-d4': 'fadeIn 0.8s ease-out 0.4s both',
        'fade-in-d5': 'fadeIn 0.8s ease-out 0.5s both',
        'slide-up-d1': 'slideUp 1s ease-out 0.1s both',
        'slide-up-d2': 'slideUp 1s ease-out 0.2s both',
        'slide-up-d3': 'slideUp 1s ease-out 0.3s both',
        'slide-up-d4': 'slideUp 1s ease-out 0.4s both',
        'slide-up-d5': 'slideUp 1s ease-out 0.5s both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleInRotate: {
          '0%': { opacity: '0', transform: 'scale(0.9) rotate(-0.5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)', clipPath: 'inset(0 0 100% 0)' },
          '100%': { opacity: '1', transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' },
        },
        revealMask: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        goldShimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'editorial': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
