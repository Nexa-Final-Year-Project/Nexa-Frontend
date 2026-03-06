"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useTheme } from "next-themes";

export function AuthBackground({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        isDark
          ? "bg-neutral-950"
          : "bg-gradient-to-b from-white via-neutral-50 to-white"
      }`}
    >
      <div
        className="fixed inset-0 -z-30"
        style={{
          background: isDark
            ? "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.10), transparent 38%), radial-gradient(circle at 82% 78%, rgba(59,130,246,0.10), transparent 40%), #0a0a0a"
            : "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.10), transparent 40%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.08), transparent 42%), #fafafa",
        }}
      />

      <div
        className="fixed inset-0 -z-20 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} 1px, transparent 1px),
            linear-gradient(90deg, ${
              isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
            } 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.22, 0.42, 0.22],
          scale: [1, 1.1, 1],
          x: [0, 18, 0],
          y: [0, -12, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -z-10 h-[520px] w-[520px] rounded-full -top-44 -left-28"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 65%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.16, 0.34, 0.16],
          scale: [1, 1.12, 1],
          x: [0, -24, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed -z-10 h-[500px] w-[500px] rounded-full -bottom-40 -right-24"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 65%)",
        }}
      />

      <motion.div
        animate={{ opacity: [0.15, 0.24, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[18%] left-0 right-0 -z-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.22) 50%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex min-h-screen w-full items-center justify-center px-4 pb-12 pt-8 sm:px-6 md:translate-x-3"
      >
        {children}
      </motion.div>

      <Footer />
    </div>
  );
}

function Footer() {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="pointer-events-none absolute inset-x-0 bottom-6 w-full text-center"
    >
      <div
        className={`flex items-center justify-center gap-3 text-xs sm:text-sm ${
          isDark ? "text-white/25" : "text-neutral-500"
        }`}
      >
        <span>© {new Date().getFullYear()} NEXA</span>
        <span
          className={`h-1 w-1 rounded-full ${
            isDark ? "bg-white/25" : "bg-neutral-400"
          }`}
        />
        <span>All rights reserved</span>
      </div>
    </motion.footer>
  );
}
