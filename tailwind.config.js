/**
 * Tailwind tokens are generated from the same source of truth as `src/theme`.
 * CSS variables are emitted per colour scheme so `dark:` variants work without
 * duplicating the palette here.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC107',
          pressed: '#F0B000',
          subtle: '#FFF8E7',
          on: '#111113',
        },
        canvas: '#F7F7F8',
        surface: { DEFAULT: '#FFFFFF', muted: '#F1F1F3' },
        line: '#E5E5E7',
        ink: { DEFAULT: '#111113', secondary: '#636366', tertiary: '#8A8A8E' },
        success: { DEFAULT: '#34A853', subtle: '#E9F6EC' },
        danger: { DEFAULT: '#E53935', subtle: '#FDECEA' },
        info: { DEFAULT: '#1A73E8', subtle: '#EAF2FE' },
      },
      fontFamily: {
        regular: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
      borderRadius: {
        md: '12px',
        lg: '14px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      spacing: {
        screen: '20px',
      },
    },
  },
  plugins: [],
};
