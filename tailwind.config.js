/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors')

module.exports = withMT({
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        english: ["Cairo", "sans-serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      colors: {
        primary: 'var(--primary)',
        hoverPrimary: 'var(--primary)',
        secondary: '#e8fffe',
        text: '#2f353b',
        textLight: '#777e90',
        inputBorder: '#DCDFE3',
        ...colors
      },
    },
  },
  plugins: [],
});
