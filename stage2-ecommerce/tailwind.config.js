/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Professional Charcoal Primary
        primary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#0F172A', // Rich charcoal - main primary
          600: '#020617',
          700: '#020617',
          800: '#020617',
          900: '#020617',
        },
        
        // Warm Amber Secondary
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Warm amber - main secondary
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        
        // Modern Indigo Accent
        accent: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Modern indigo
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
        },

        // Warm Professional Grays  
        gray: {
          50: '#FAFAFA',
          100: '#F7F3F0',
          200: '#E8E1DB',
          300: '#D4C9C0',
          400: '#A19086',
          500: '#6B645C',
          600: '#4A443E',
          700: '#2C2C2C',
          800: '#1A1A1A',
          900: '#0F0F0F',
        },

        // Status colors using our palette
        success: {
          50: '#E8F4EA',
          500: '#2D5A3D',
          600: '#1F3D2A',
        },
        warning: {
          50: '#FDF9E8',
          500: '#D4AF37',
          600: '#B8941F',
        },
        error: {
          50: '#FEF2F2',
          500: '#B91C1C',
          600: '#991B1B',
        },
        info: {
          50: '#EFF6FF',
          500: '#1E40AF',
          600: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        // Professional, subtle animations - not AI-typical
        'fade-in': 'professionalFadeIn 200ms ease-out',
        'slide-in': 'professionalSlideIn 150ms ease-out',
        'scale-in': 'professionalScaleIn 150ms ease-out',
        'text-reveal': 'textReveal 800ms ease-out',
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
        'professional-bounce': 'professionalBounce 400ms ease-out',
      },
      keyframes: {
        professionalFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        professionalSlideIn: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        professionalScaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        textReveal: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '60%': { transform: 'translateY(-2px)', opacity: '0.8' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        professionalBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      
      // Professional spacing and sizing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
