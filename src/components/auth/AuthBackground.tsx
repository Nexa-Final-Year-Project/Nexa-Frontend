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
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden ${
        isDark
          ? "bg-[#050508]"
          : "bg-gradient-to-b from-white via-[#f7f8ff] to-white"
      }`}
    >
      {/* Base gradient */}
      <div
        className="fixed inset-0 -z-30"
        style={{
          background: isDark
            ? "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.08), transparent 35%), radial-gradient(circle at 80% 80%, rgba(34,211,238,0.08), transparent 40%), #050508"
            : "radial-gradient(circle at 25% 25%, rgba(139,92,246,0.08), transparent 40%), radial-gradient(circle at 75% 75%, rgba(34,211,238,0.08), transparent 45%), #f7f8ff",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 -z-25 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${
              isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
            } 1px, transparent 1px),
            linear-gradient(90deg, ${
              isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
            } 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.25, 0.5, 0.25],
          scale: [1, 1.08, 1],
          x: [0, 24, 0],
          y: [0, -16, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -z-10 w-[700px] h-[700px] rounded-full top-[-320px] left-[-260px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 60%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.18, 0.36, 0.18],
          scale: [1, 1.12, 1],
          x: [0, -30, 0],
          y: [0, 26, 0],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed -z-10 w-[620px] h-[620px] rounded-full bottom-[-200px] right-[-220px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Third accent orb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.16, 1] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="fixed -z-10 w-[380px] h-[380px] rounded-full top-[32%] right-[-80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Animated floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.45, 0],
              y: [0, -140],
              x: [0, Math.random() * 36 - 18],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: i * 1.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              left: `${5 + i * 8}%`,
              bottom: "6%",
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background:
                i % 2 === 0 ? "rgba(139,92,246,0.6)" : "rgba(34,211,238,0.5)",
            }}
          />
        ))}
      </div>

      {/* Center glow */}
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[980px] h-[520px] rounded-full blur-3xl bg-gradient-to-r from-violet-500/30 via-purple-500/18 to-cyan-500/26"
      />

      {/* Sweeping neon beam */}
      <motion.div
        initial={{ x: "-40%", opacity: 0 }}
        animate={{ x: "120%", opacity: [0, 0.5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/2 left-0 w-[40%] h-[120px] -translate-y-1/2 -z-5 blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.2) 30%, rgba(34,211,238,0.28) 60%, transparent 100%)",
        }}
      />

      {/* Subtle chevron echoes like Clerk */}
      <div className="fixed inset-0 -z-15 pointer-events-none">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${22 + i * 9}%`,
              width: `${82 - i * 8}%`,
              height: 180,
              borderRadius: 36,
              border: `1px solid ${
                isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"
              }`,
              opacity: 0.5 - i * 0.2,
              clipPath:
                "polygon(0 30%, 45% 30%, 50% 45%, 55% 30%, 100% 30%, 100% 70%, 0 70%)",
            }}
          />
        ))}
      </div>

      {/* Horizontal light beams */}
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent -z-10 dark:via-white/20"
      />
      <motion.div
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        className="fixed top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -z-10"
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container relative flex flex-1 w-full items-center justify-center px-4 sm:px-6 py-6"
      >
        {children}
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="absolute bottom-6 w-full text-center"
    >
      <div className="flex items-center justify-center gap-4 text-sm text-white/20">
        <span>© {new Date().getFullYear()} NEXA</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>All rights reserved</span>
      </div>
    </motion.footer>
  );
}
