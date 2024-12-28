const colors = require('./src/app/assets/styles/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: colors.COLOR_PALETTE
    },
  },
  plugins: [],
}

