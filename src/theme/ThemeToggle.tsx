"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
    );
  }

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`
        w-14 h-8 flex items-center cursor-pointer rounded-full p-1 transition-colors
        ${isDark ? "bg-neutral-700" : "bg-neutral-200"}
        focus:outline-none focus:ring-2 focus:ring-neutral-400
      `}
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`
          h-6 w-6 rounded-full shadow-md flex items-center justify-center
          ${isDark ? "bg-white" : "bg-amber-100"}
        `}
        style={{
          x: isDark ? 26 : 0,
        }}
      >
        {isDark ? (
          <MoonIcon className="w-3 h-3 text-neutral-700" />
        ) : (
          <SunIcon className="w-3 h-3 text-amber-600" />
        )}
      </motion.div>
    </button>
  );
}
