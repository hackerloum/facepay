import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0F1E",
        "bg-secondary": "#111827",
        "accent-blue": "#00D4FF",
        "accent-green": "#00FF87",
        "accent-red": "#FF4757",
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        border: "#1E2A3A",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "system-ui", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
