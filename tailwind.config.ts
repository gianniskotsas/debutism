import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-serif": ["var(--font-dm-serif)"],
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(100%, -80%) scale(0.5)", // Start from top-right
          },
          "100%": {
            opacity: "1",
            transform: "translate(-20%, -20%) scale(1)", // End at bottom-left area
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;