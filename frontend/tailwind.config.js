/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Geist"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"SF Mono"', 'monospace'],
      },
      colors: {
        ink: '#0A0A0A',
        bone: '#F7F6F3',
        mist: '#EAEAEA',
        smoke: '#787774',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
}
