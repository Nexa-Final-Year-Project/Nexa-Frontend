"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`
        w-14 h-8 flex items-center rounded-full p-1 transition-colors
        ${theme === "dark" ? "bg-gradient-stone-cable" : "bg-gray-300"}
        focus:outline-none focus:ring-2 focus:ring-blue-500
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
          ${theme === "dark" ? "bg-white" : "bg-yellow-200"}
        `}
        style={{
          x: theme === "dark" ? 26 : 0,
        }}
      >
        {theme === "dark" ? (
          <MoonIcon className="w-3 h-3 text-stone-cable" />
        ) : (
          <SunIcon className="w-3 h-3 text-yellow-600" />
        )}
      </motion.div>
    </button>
  );
}
