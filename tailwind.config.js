/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customRed: "rgba(252,156,115,255)",
        customPurple: "rgba(126,91,134,255)",
      },
    },
  },
  plugins: [],
}

