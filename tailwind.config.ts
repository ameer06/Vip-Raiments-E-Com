import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        bone: "#fafafa",
        "electric-blue": "#000000"
      },
      boxShadow: {
        brutal: "0 1px 3px 0 rgba(0,0,0,0.08)",
        "brutal-blue": "0 1px 3px 0 rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
