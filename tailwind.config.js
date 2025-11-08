/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text)-(red|blue|green|yellow|purple|pink|orange|gray|teal|cyan|lime|amber|emerald|fuchsia|indigo|violet|rose|stone)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

