/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      "5xs": "320px",
      "4xs": "384px",
      "3xs": "448px",
      "2xs": "512px",
      xs: "576px",
      md_semi_lg: {
        min: "768px",
        max: "867px",
      },
      ...defaultTheme.screens,
    },
  },
  safelist: ["text-blue-600"],
  plugins: [],
};
