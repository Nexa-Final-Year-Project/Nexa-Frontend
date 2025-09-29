"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInMotion } from "@/lib/animations/fade";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export const PageTransition = ({
  children,
  className,
}: PageTransitionProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInMotion("up", 0.5, 0.5)}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
