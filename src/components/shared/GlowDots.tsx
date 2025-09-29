"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

// Predefined grid column classes
const gridColsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
};

// Predefined gap classes
const gapXClasses = {
  1: "gap-x-1",
  2: "gap-x-2",
  3: "gap-x-3",
  4: "gap-x-4",
  5: "gap-x-5",
};
const gapYClasses = {
  1: "gap-y-1",
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  5: "gap-y-5",
};

// Predefined size classes
const sizeClasses = {
  1: "w-1 h-1",
  2: "w-2 h-2",
  3: "w-3 h-3",
  4: "w-4 h-4",
  5: "w-5 h-5",
};

export default function GlowDots({
  className = "",
  noOfDots = 16,
  delay = 0.2,
  spacingX = 2,
  spacingY = 2,
  size = 2,
  cols = 4,
  color = "bg-primary",
}: {
  className?: string;
  noOfDots?: number;
  delay?: number;
  spacingX?: number;
  spacingY?: number;
  size?: number;
  cols?: number;
  color?: string;
}) {
  // Clamp values to ensure they're within our predefined ranges
  const safeCols = Math.min(Math.max(cols, 1), 8);
  const safeSpacingX = Math.min(Math.max(spacingX, 1), 5);
  const safeSpacingY = Math.min(Math.max(spacingY, 1), 5);
  const safeSize = Math.min(Math.max(size, 1), 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        "grid",
        gridColsClasses[safeCols as keyof typeof gridColsClasses],
        gapXClasses[safeSpacingX as keyof typeof gapXClasses],
        className
      )}
    >
      {Array.from({ length: noOfDots }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full shadow-neon animate-pulse",
            sizeClasses[safeSize as keyof typeof sizeClasses],
            color
          )}
        />
      ))}
    </motion.div>
  );
}
