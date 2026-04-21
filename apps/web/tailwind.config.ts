import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        fg: "rgb(7 26 51 / <alpha-value>)",
        muted: "rgb(90 107 128 / <alpha-value>)",
        paper: "rgb(240 245 251 / <alpha-value>)",
        "paper-bright": "rgb(255 255 255 / <alpha-value>)",
        elevated: "rgb(255 255 255 / <alpha-value>)",
        line: "rgb(197 211 227 / <alpha-value>)",
        blue: "rgb(0 71 171 / <alpha-value>)",
        "blue-hover": "#003580",
        accent: "rgb(200 16 46 / <alpha-value>)",
        "accent-hover": "#a30d25",
        ink: "rgb(7 26 51 / <alpha-value>)",
      },
      fontFamily: {
        display: [
          "var(--font-ui-serif)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        "mono-ui": [
          "var(--font-ui-mono)",
          "ui-monospace",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
