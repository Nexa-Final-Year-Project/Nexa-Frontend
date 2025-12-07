// components/ui/auth/AuthFooter.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

type AuthFooterProps = {
  text: string;
  linkText: string;
  href: string;
  className?: string;
};

export function AuthFooter({
  text,
  linkText,
  href,
  className,
}: AuthFooterProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`text-center text-sm pt-4 ${className}`}
    >
      <span className={isDark ? "text-white/50" : "text-neutral-600"}>
        {text}
      </span>{" "}
      <Link
        href={href}
        className={`transition-colors font-medium relative group ${
          isDark
            ? "text-violet-400 hover:text-violet-300"
            : "text-violet-600 hover:text-violet-700"
        }`}
      >
        {linkText}
        <span
          className={`absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${
            isDark ? "bg-violet-400" : "bg-violet-600"
          }`}
        />
      </Link>
    </motion.div>
  );
}
