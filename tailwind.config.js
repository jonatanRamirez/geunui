
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mcdRed: "#DA291C",
        mcdYellow: "#FFC72C",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)",
      }
    },
  },
  plugins: [],
};
