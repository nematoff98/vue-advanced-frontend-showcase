import { generateTailwindColors, colors } from './src/utils'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      maxMobile: '750px',
      minMobile: '500px',
    },
    extend: {
      colors: {
        white: '#ffffff',
        ...generateTailwindColors(),
      },
      fontSize: {
        '3xl': ['28px', { lineHeight: '32px' }],
        '2xl': ['24px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '24px' }],
        l: ['18px', { lineHeight: '22px' }],
        m: ['16px', { lineHeight: '20px' }],
        s: ['14px', { lineHeight: '18px' }],
        xs: ['12px', { lineHeight: '16px' }],
        xxs: ['10px', { lineHeight: '12px' }],
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'], // Default font-family
      },
      fontWeight: {
        regular: '400', // Regular
        medium: '500', // Medium
        semibold: '600', // SemiBold
        bold: '700', // Bold
      },
      boxShadow: {
        // Drop shadows (Down)
        sm: '0 4px 6px 0 rgba(0, 0, 0, 0.06)', // Small Down
        md: '0 10px 16px 0 rgba(0, 0, 0, 0.05)', // Medium Down
        lg: '0 20px 30px 0 rgba(0, 0, 0, 0.08)', // Large Down

        // Centered shadows
        'sm-center': '0 1px 6px 0 rgba(0, 0, 0, 0.06)', // Small Center
        'md-center': '0 1px 16px 0 rgba(0, 0, 0, 0.05)', // Medium Center
        'lg-center': '0 1px 30px 0 rgba(0, 0, 0, 0.08)', // Large Center

        // Stroke shadows
        'stroke-normal': '0 0 0 4px #989DA51A', // Stroke Normal
        'stroke-primary': '0 0 0 4px #93C5FD40', // Stroke Primary
        'stroke-error': '0 0 0 4px #FCA5A540', // Stroke Error
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.dark': {
          '.border-gray-100, .border-gray-200': {
            borderColor: colors.gray['600'],
          },
          '.text-gray-700': {
            color: '#ffffff',
          },
          '.text-gray-600': {
            color: colors.gray['300'],
          },
          '.text-gray-500': {
            color: colors.gray['300'],
          },
          '.bg-white': {
            backgroundColor: colors.gray['800'],
          },
          '.bg-gray-50, .bg-gray-100': {
            color: '#ffffff',
            backgroundColor: colors.gray['700'],
            svg: {
              color: '#ffffff',
            },
          },
          '.bg-primary-50, .bg-primary-100': {
            color: '#ffffff',
            backgroundColor: colors.primary['500'],
          },
          '.bg-yellow-50, .bg-yellow-100': {
            color: '#ffffff',
            backgroundColor: colors.yellow['500'],
          },
          '.bg-indigo-50, .bg-indigo-100': {
            color: '#ffffff',
            backgroundColor: colors.indigo['500'],
          },
          '.bg-green-50, .bg-green-100': {
            color: '#ffffff',
            backgroundColor: colors.green['500'],
          },
        },
      })
    },
  ],
}
