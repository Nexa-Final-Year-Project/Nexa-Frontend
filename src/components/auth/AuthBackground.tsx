"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInMotion } from "@/lib/animations/fade";

export function AuthBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      {/* Animated background elements */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInMotion("up", 0.5, 0.5)}
        className="absolute inset-0 -z-10 overflow-hidden"
      ></motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8 "
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
      transition={{ delay: 0.5 }}
      className="absolute bottom-4 w-full text-center text-sm text-muted-foreground"
    >
      © {new Date().getFullYear()} NEXA. All rights reserved.
    </motion.footer>
  );
}
