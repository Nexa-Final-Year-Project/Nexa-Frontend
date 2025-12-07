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
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`relative p-16 space-y-8 rounded-3xl backdrop-blur-sm border shadow-2xl ${
          isDark
            ? "bg-neutral-900/85 border-white/[0.1]"
            : "bg-white border-neutral-300"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Logo size={80} textSize="text-5xl" />
        </div>

        {/* Title and subtitle */}
        <div className="space-y-3 text-center">
          <h1
            className={`text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-lg ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
};
