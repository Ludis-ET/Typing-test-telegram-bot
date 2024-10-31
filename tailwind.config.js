/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-light": "#f3e8ff",
        "purple-medium": "#d1b3ff",
        "purple-dark": "#8f61ff",
        "purple-darker": "#6200ea",
      },
      gradientColorStops: {
        "purple-start": "#f3e8ff",
        "purple-end": "#d1b3ff",
      },
    },
  },
  plugins: [],
};