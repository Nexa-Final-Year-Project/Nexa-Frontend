"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";
import { fadeInMotion } from "@/lib/animations/fade";

type CardProps = {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  animation?: "fade" | "none";
  onClick?: () => void;
} & Omit<HTMLMotionProps<"div">, "children" | "className" | "onClick">;

const Card = ({
  children,
  className,
  hoverEffect = true,
  animation = "fade",
  onClick,
  ...props
}: CardProps) => {
  const animations = {
    fade: fadeInMotion(),
    none: {},
  };

  return (
    <motion.div
      variants={animations[animation]}
      initial="hidden"
      animate="visible"
      whileHover={hoverEffect ? { y: -2 } : {}}
      transition={{ duration: 0.3 }}
      className={cn("glass-card", onClick && "cursor-pointer", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { Card };
