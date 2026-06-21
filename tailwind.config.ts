import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff8ec",
        ink: "#2b2529",
        berry: "#d94f86",
        mint: "#92d8c2",
        sunny: "#ffd36a",
        lilac: "#b9a7ff"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(84, 55, 83, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
