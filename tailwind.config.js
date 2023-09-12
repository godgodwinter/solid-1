/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      "cupcake",
      "winter",
      "luxury",
      {
        babeng: {
          primary: "#65c3c8",

          secondary: "#ef9fbc",

          accent: "#eeaf3a",

          neutral: "#291334",

          "base-100": "#faf7f5",

          info: "#3abff8",

          success: "#36d399",

          warning: "#fbbd23",

          error: "#f87272",
        },
      },
    ],
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
