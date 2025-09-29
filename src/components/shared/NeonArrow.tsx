"use client";
import { motion } from "framer-motion";
import {
  IconArrowBadgeDown,
  IconArrowBadgeUp,
  IconChevronDown,
  IconChevronUp,
  IconCircleChevronDownFilled,
  IconCircleChevronUpFilled,
} from "@tabler/icons-react";

type NeonArrowProps = {
  color?: string;
  gap?: number;
  size?: number;
  direction?: "up" | "down";
  filled?: boolean;
  stroke?: number;
  className?: string;
};

export default function NeonArrow({
  color = "currentColor",
  gap = 1,
  size = 64,
  direction = "down",
  filled = false,
  stroke = 1,
  className = "",
}: NeonArrowProps) {
  const bounce = direction === "down" ? [0, -gap, 0] : [0, gap, 0];

  const Icon =
    direction === "down"
      ? filled
        ? IconCircleChevronDownFilled
        : IconArrowBadgeDown
      : filled
      ? IconCircleChevronUpFilled
      : IconArrowBadgeUp;

  return (
    <motion.div
      animate={{ y: bounce }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      }}
      style={{ color }}
      className={className}
    >
      <Icon
        stroke={stroke}
        size={size}
        className={`mx-auto text-stone-cable`}
      />
    </motion.div>
  );
}
