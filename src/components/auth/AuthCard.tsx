"use client";

import { motion } from "framer-motion";
import Logo from "@/components/shared/Logo";
import { Sparkles } from "lucide-react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-md w-full relative"
    >
      {/* Glow effect behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-cyan-500/20 rounded-3xl blur-xl opacity-50" />

      <div className="relative p-8 space-y-6 rounded-2xl bg-white dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200 dark:border-white/[0.08] shadow-2xl shadow-black/10 dark:shadow-black/40">
        {/* Decorative top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Logo with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="relative">
            <Logo size={64} textSize="text-4xl" />
            {/* Subtle glow behind logo */}
            <div className="absolute inset-0 -z-10 bg-emerald-500/20 blur-2xl rounded-full" />
          </div>
        </motion.div>

        {/* Title and subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs text-neutral-500 dark:text-white/40 uppercase tracking-widest">
              Welcome
            </span>
            <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-white/50">{subtitle}</p>
        </motion.div>

        {/* Children with stagger animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>

        {/* Decorative bottom elements */}
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-emerald-500/30" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-cyan-500/30" />
      </div>
    </motion.div>
  );
};
