const colors = require("tailwindcss/colors")

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      tertiarybg: "#292929",
      secondarybg: "#1E1E1E",
      primarybg:"121213",
      borderColor: "#27272A",
      accent100: "#EB634D",
      accent80: "#EF8271",
      accent75: "#F08A79",
      accent20: "#FBE0DB",
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
