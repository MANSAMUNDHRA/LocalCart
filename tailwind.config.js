/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF7A30",
        "primary-dark": "#E56A20",
        background: "#F5EFE6",
        card: "#FFFFFF",
        "text-primary": "#1F1F1F",
        "text-secondary": "#6B6B6B",
        success: "#34C759",
        warning: "#FFCC00",
        danger: "#FF3B30",
        accent: "#FF9F6A",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
