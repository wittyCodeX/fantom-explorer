module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
  variants: {
    scrollbar: ['rounded'],
  },
}
