/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nexdark: '#1A1D23',
        nexcanvas: '#F5F5F7',
        nexaccent: '#5B7A99',
        nextext: '#2A2D34',
        nexmuted: '#6B7280',
      }
    },
  },
  plugins: [],
}

