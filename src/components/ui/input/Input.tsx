"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { forwardRef } from "react";
import { fadeInMotion } from "@/lib/animations/fade";

type InputProps = {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, containerClassName, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);

    return (
      <motion.div
        variants={fadeInMotion("up", 0.5, 0.5)}
        className={cn("space-y-1 w-full", containerClassName)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              error && "border-destructive focus-visible:ring-destructive/30",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export { Input };
