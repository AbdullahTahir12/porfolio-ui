"use client";

import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      aria-label="Toggle color theme"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-surface bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] shadow-[0_20px_45px_-25px_var(--color-shadow)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-outline)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:border-[color:var(--color-accent-outline)] hover:text-[color:var(--color-accent)] animate-ripple"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
        transition={spring}
        className="absolute"
      >
        {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      </motion.span>
    </motion.button>
  );
}
