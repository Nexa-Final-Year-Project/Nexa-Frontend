// components/ui/auth/Divider.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function AuthDivider({ text = "Or continue with" }: { text?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`w-full h-px bg-gradient-to-r from-transparent via-current to-transparent origin-center ${
            isDark ? "text-white/15" : "text-neutral-300"
          }`}
        />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`px-3 tracking-[0.3em] font-semibold ${
            isDark ? "bg-[#0a0a0f]/80 text-white/55" : "bg-white/90 text-neutral-500"
          }`}
        >
          {text}
        </motion.span>
      </div>
    </div>
  );
}
