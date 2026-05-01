import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        backgroundSecondary: "var(--color-background-secondary)",
        foreground: "var(--color-foreground)",
        foregroundSecondary: "var(--color-foreground-secondary)",
        accent: "var(--color-accent)",
        accentSoft: "var(--color-accent-soft)",
        accentOutline: "var(--color-accent-outline)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 8px 30px rgba(79, 107, 255, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
