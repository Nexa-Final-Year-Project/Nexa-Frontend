// app/layout.tsx
import "./globals.css";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Providers } from "./providers/Providers";
import { ColorSchemeScript } from "@mantine/core";
import { ReduxProvider } from "./providers/ReduxProvider";
import { ThemeSyncer } from "./ThemeSync";
import { Toaster } from "sonner";
import { ModalRenderer } from "@/components/modals/ModalRenderer";
import { AuthStateManager } from "@/components/auth/AuthStateManager";
import { KeyboardShortcutsProvider } from "@/components/shared/KeyboardShortcutsProvider";

export const metadata: Metadata = {
  title: "Nexa - AI-Powered Project Management",
  description:
    "Intelligent project management platform that automates planning, surfaces insights, and helps your team deliver faster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="!bg-background" suppressHydrationWarning>
        <ReduxProvider>
          <Providers>
            <KeyboardShortcutsProvider>
              <AuthStateManager />
              {/* <ThemeSyncer /> */}
              <main>{children}</main>
              <Toaster
                position="bottom-right"
                richColors
                toastOptions={{
                  style: {
                    background: "var(--background)",
                    border: "none",
                  },
                  classNames: {
                    toast: "glass-card",
                    title: "font-medium text-sm",
                    description: " text-xs",
                  },
                }}
              />
              <ModalRenderer />
            </KeyboardShortcutsProvider>
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
