/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      aspectRatio: {
        '16/10': '16 / 10',
      }
    },
  },
  plugins: [],
};
