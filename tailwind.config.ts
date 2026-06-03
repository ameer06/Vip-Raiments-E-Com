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
        ink: "#050505",
        bone: "#f4f2ed",
        "electric-blue": "#175cff"
      },
      boxShadow: {
        brutal: "5px 5px 0 #050505",
        "brutal-blue": "5px 5px 0 #175cff"
      }
    }
  },
  plugins: []
};

export default config;
