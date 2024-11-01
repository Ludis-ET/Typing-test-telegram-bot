/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-darker": "#3C096C",
        "purple-dark": "#5A189A",
        "purple-medium": "#7B2CBF",
        "purple-light": "#9D4EDD",
        "purple-lightest": "#C77DFF",
        "bg-dark": "#1B1B2F",
      },
    },
  },
  plugins: [],
};