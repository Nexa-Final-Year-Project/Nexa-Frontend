"use client";

import { useEffect } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { useTheme } from "next-themes";

export function ThemeSyncer() {
  const { setColorScheme } = useMantineColorScheme();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setColorScheme("dark");
    } else {
      setColorScheme("light");
    }
  }, [resolvedTheme, setColorScheme]);

  return null;
}
