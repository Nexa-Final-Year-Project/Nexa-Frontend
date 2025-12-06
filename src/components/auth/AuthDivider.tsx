// components/ui/auth/Divider.tsx
"use client";

import { motion } from "framer-motion";

export function AuthDivider({ text = "Or continue with" }: { text?: string }) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"
        />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a0a0f] px-4 text-white/50 tracking-widest font-medium"
        >
          {text}
        </motion.span>
      </div>
    </div>
  );
}
