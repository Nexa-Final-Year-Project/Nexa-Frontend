import { Variants } from "framer-motion";
export const fadeInMotion = (
  direction: "up" | "down" | "left" | "right" | "none" = "none",
  duration = 0.6,
  delay = 0
): Variants => {
  let x = 0,
    y = 0;

  if (direction === "up") y = 20;
  else if (direction === "down") y = -20;
  else if (direction === "left") x = 20;
  else if (direction === "right") x = -20;

  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  };
};
