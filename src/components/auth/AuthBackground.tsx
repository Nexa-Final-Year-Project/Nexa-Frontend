"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AuthBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#050508] overflow-hidden">
      {/* Base gradient - deeper black */}
      <div className="fixed inset-0 -z-30 bg-[#050508]" />

      {/* Subtle grid pattern - more refined */}
      <div
        className="fixed inset-0 -z-25 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs - animated */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -z-10 w-[700px] h-[700px] rounded-full top-[-300px] left-[-300px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 60%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.15, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed -z-10 w-[600px] h-[600px] rounded-full bottom-[-200px] right-[-200px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Third accent orb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="fixed -z-10 w-[400px] h-[400px] rounded-full top-[30%] right-[-100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Animated floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, -150],
              x: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              left: `${5 + i * 8}%`,
              bottom: "5%",
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background:
                i % 2 === 0 ? "rgba(139,92,246,0.5)" : "rgba(34,211,238,0.4)",
            }}
          />
        ))}
      </div>

      {/* Center glow - pulsing */}
      <motion.div
        animate={{
          opacity: [0.03, 0.06, 0.03],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[1000px] h-[500px] rounded-full blur-3xl bg-gradient-to-r from-violet-500/30 via-purple-500/20 to-cyan-500/30"
      />

      {/* Horizontal light beams */}
      <motion.div
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -z-10"
      />
      <motion.div
        animate={{ opacity: [0.01, 0.03, 0.01] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        className="fixed top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -z-10"
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
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
