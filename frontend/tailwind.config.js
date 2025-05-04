const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        red: colors.red,
        blue: colors.blue,
        green: colors.green,
        pink: colors.pink,
        zinc: colors.zinc,
        neutral: colors.neutral,
      },
    },
  },
  plugins: [],
}
