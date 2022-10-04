const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["'Poppins'", "sans-serif"],
        zen: ["'Zen Dots'", "cursive"],
        arial: ["'Arial Black'", "sans-serif"]
      }
    }
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
  variants: {
    scrollbar: ["rounded"]
  }
});
