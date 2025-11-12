/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bridal: {
          cream: '#FAFAFA',
          sage: {
            50: '#F5F6F5',
            100: '#E6E8E6',
            200: '#CDD1CD',
            300: '#B4BAB4',
            400: '#9BA39B',
            500: '#868E85',
            600: '#757D74',
            700: '#5D635C',
            800: '#464A45',
            900: '#2E312E',
          },
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Avenir', 'Avenir Next', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
