// components/ThemeInitializer.tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeInitializer() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Force light theme on initial load
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme || savedTheme === "system") {
        setTheme("light");
        localStorage.setItem("theme", "light");
      }
    }
  }, [setTheme]);

  return null;
}