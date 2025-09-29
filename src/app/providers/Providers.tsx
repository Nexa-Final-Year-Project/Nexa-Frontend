"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Remove manual color scheme sync - let next-themes handle it
  // const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
