/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "xs": "10px",
        "sm": "0.8rem",
        "base": "1rem",
        "xl": "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        hairlineLato: ["Lato Hairline", "sans-serif"],
        // hairlineItalicLato: ['Lato Hairline-Italic', 'sans-serif'],
        lightLight: ["Lato Light", "sans-serif"],
        lightItalicLato: ["Lato Light Italic", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        italicLato: ["Lato Italic", "sans-serif"],
        boldLato: ["Lato Bold", "sans-serif"],
        boldItalicLato: ["Lato Bold Italic", "sans-serif"],
        blackLato: ["Lato Black", "sans-serif"],
        blackItalicLato: ["Lato Black Italic", "sans-serif"],
      },
    },
    screens: {
      "xs": "320px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
