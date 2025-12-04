"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { fadeInMotion } from "@/lib/animations/fade";
import { staggerContainer } from "@/lib/animations/stagger";

type BuiltInVariants = "fade" | "stagger" | "slide";

type AnimatedDivProps = {
  children: ReactNode;
  variant?: BuiltInVariants;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
};

export const AnimatedDiv = ({
  children,
  variant = "fade",
  direction = "none",
  delay = 0,
  duration = 0.6,
  className,
}: AnimatedDivProps) => {
  const getVariant = (): Variants => {
    switch (variant) {
      case "fade":
        return fadeInMotion(direction, duration, delay);
      case "stagger":
        return staggerContainer;
      default:
        return fadeInMotion(direction, duration, delay);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={getVariant()}
      className={className}
    >
      {children}
    </motion.div>
  );
};
