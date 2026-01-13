"use client";

import { motion } from "framer-motion";
import Logo from "@/components/shared/Logo";
import { useTheme } from "next-themes";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative w-full max-w-[430px] mx-auto px-3 sm:px-0">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <div
          className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-violet-500/25 via-cyan-400/20 to-transparent blur-2xl opacity-60"
          aria-hidden
        />
        <div
          className={`relative overflow-hidden rounded-[26px] border shadow-[0_12px_48px_rgba(0,0,0,0.24)] ${
            isDark
              ? "bg-neutral-900/85 border-white/[0.12] backdrop-blur-xl"
              : "bg-white/94 border-neutral-200/70 backdrop-blur-xl"
          }`}
        >
          <div
            className={`absolute inset-0 pointer-events-none opacity-60 ${
              isDark
                ? "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_45%)]"
                : "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_45%)]"
            }`}
            aria-hidden
          />

          <div className="relative p-6 sm:p-7 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2.5 rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm border border-white/10 bg-white/5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white text-neutral-700">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                <span className={isDark ? "text-white/80" : "text-neutral-700"}>
                  NEXA Secure Access
                </span>
              </div>
              <Logo size={42} textSize="text-xl" />
            </div>

            <div className="space-y-3 text-center">
              <h1
                className={`text-[23px] sm:text-[26px] font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {title}
              </h1>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-white/60" : "text-neutral-600"
                }`}
              >
                {subtitle}
              </p>
            </div>

            <div className="mt-1">{children}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
