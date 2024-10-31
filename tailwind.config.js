/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-light": "#E0BBE4",
        "purple-medium": "#957DAD",
        "purple-dark": "#4B2D5A",
        "purple-accent": "#D291BC",
        "purple-deep": "#512D6D",
      },
    },
  },
  plugins: [],
};
