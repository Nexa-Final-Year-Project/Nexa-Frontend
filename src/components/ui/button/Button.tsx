"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button as MantineButton } from "@mantine/core";
import { AnimatedDiv } from "@/components/shared/AnimatedDiv";
import { Spinner } from "@/components/shared/Spinner";

type ButtonProps = {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "destructive"
    | "filled"
    | "outline"
    | "light"
    | "subtle";
  size?: "sm" | "md" | "lg" | "xs" | "xl";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  color?: string;
  fullWidth?: boolean;
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
  styles?: Record<string, any>;
  Icon?: ReactNode;
  iconPosition?: "left" | "right";
};

export const Button = ({
  children,
  variant = "filled",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  color = "blue",
  fullWidth = false,
  radius = "md",
  styles = {},
  Icon,
  iconPosition = "left",
  ...props
}: ButtonProps) => {
  const combinedStyles = {
    root: {
      ...styles,
    },
  };

  const renderIcon = () =>
    Icon ? <span className="flex-shrink-0">{Icon}</span> : null;

  return (
    <AnimatedDiv variant="fade" className={fullWidth ? "w-full" : ""}>
      <MantineButton
        component={motion.button}
        variant={variant}
        size={size}
        color={color}
        type={type}
        loading={loading}
        disabled={disabled}
        fullWidth={fullWidth}
        radius={radius}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        classNames={{
          root: className,
        }}
        styles={combinedStyles}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Spinner className="mr-1" size="sm" />
            {children}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {iconPosition === "left" && renderIcon()}
            {children}
            {iconPosition === "right" && renderIcon()}
          </div>
        )}
      </MantineButton>
    </AnimatedDiv>
  );
};
