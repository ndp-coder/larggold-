/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ['"Open Sans"', 'Arial', 'sans-serif'],
      },
      colors: {
        'ams-gold':      '#fcc201',
        'ams-gold-dark': '#b8860b',
        'ams-green':     '#009a52',
        'ams-red':       '#ee2d24',
        'ams-logo-red':  '#E30613',
      },
    },
  },
  plugins: [],
};
