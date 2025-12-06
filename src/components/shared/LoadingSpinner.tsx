"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sizeMap = {
    sm: { container: "w-10 h-10", ring: "w-10 h-10", dot: "w-1.5 h-1.5" },
    md: { container: "w-14 h-14", ring: "w-14 h-14", dot: "w-2 h-2" },
    lg: { container: "w-20 h-20", ring: "w-20 h-20", dot: "w-2.5 h-2.5" },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className={`relative ${sizeMap[size].container}`}>
        {/* Outer rotating ring */}
        <motion.div
          className={`absolute inset-0 ${
            sizeMap[size].ring
          } rounded-full border ${
            isDark ? "border-white/[0.08]" : "border-neutral-200"
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
              isDark ? "bg-white" : "bg-neutral-600"
            }`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Middle pulsing ring */}
        <motion.div
          className={`absolute inset-2 rounded-full ${
            isDark ? "bg-white/5" : "bg-neutral-200/50"
          }`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner rotating element */}
        <motion.div
          className="absolute inset-3 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
              isDark ? "bg-white/60" : "bg-neutral-500"
            }`}
          />
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
              isDark ? "bg-white/40" : "bg-neutral-400"
            }`}
          />
        </motion.div>

        {/* Center glowing dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-white/80" : "bg-neutral-700"
            }`}
          />
        </motion.div>
      </div>

      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm ${
            isDark ? "text-white/50" : "text-neutral-500"
          } tracking-wide`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Full page loading state - Clean minimal style
export const PageLoading: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Outer orbit ring */}
          <motion.div
            className="w-20 h-20 rounded-full border border-neutral-200 dark:border-white/[0.06]"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neutral-600 dark:bg-white/80"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(139,92,246,0.5)",
                  "0 0 20px rgba(139,92,246,0.8)",
                  "0 0 10px rgba(139,92,246,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Middle orbit ring */}
          <motion.div
            className="absolute inset-2 rounded-full border border-white/[0.04]"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
              animate={{
                boxShadow: [
                  "0 0 8px rgba(34,211,238,0.5)",
                  "0 0 16px rgba(34,211,238,0.8)",
                  "0 0 8px rgba(34,211,238,0.5)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Inner pulsing core */}
          <motion.div
            className="absolute inset-5 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center dot */}
          <motion.div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-white"
              animate={{
                scale: [0.8, 1.1, 0.8],
                boxShadow: [
                  "0 0 10px rgba(255,255,255,0.3)",
                  "0 0 25px rgba(255,255,255,0.6)",
                  "0 0 10px rgba(255,255,255,0.3)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Background glow effects */}
          <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-2xl -z-10" />
          <div className="absolute inset-4 rounded-full bg-cyan-500/5 blur-xl -z-10" />
        </motion.div>

        {/* Text with typing animation */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm font-medium tracking-wider"
          >
            {text}
          </motion.p>
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Auth loading state - "Signing you in..." style
export const AuthLoading: React.FC<{ text?: string }> = ({
  text = "Signing you in...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center gap-10"
      >
        {/* Animated logo/icon area */}
        <div className="relative w-32 h-32">
          {/* Outer scanning ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              background:
                "linear-gradient(#0a0a0f, #0a0a0f) padding-box, linear-gradient(135deg, rgba(139,92,246,0.5), transparent, rgba(34,211,238,0.5)) border-box",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Second ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-white/[0.06]"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" />
          </motion.div>

          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-white/[0.08]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Center icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl -z-10" />
        </div>

        {/* Text section */}
        <div className="flex flex-col items-center gap-3">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-white tracking-tight"
          >
            {text}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-white/40"
          >
            Please wait a moment
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5 }}
            className="w-48 h-1 bg-white/[0.06] rounded-full overflow-hidden mt-4"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: "50%" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Button loading state
export const ButtonLoading: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <motion.div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-current"
            animate={{
              y: [0, -4, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Skeleton loading for content
export const SkeletonLoader: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <motion.div
      className={`bg-white/[0.04] rounded-lg ${className}`}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export default LoadingSpinner;
