/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        vanguardRed: '#6e2925',
        vanguardOrange: '#fec633',
      },
      dropShadow: {
        'vanguard-shadow': '3px 0px 0px #000000',
      }
    },
  },
  plugins: [],
};
