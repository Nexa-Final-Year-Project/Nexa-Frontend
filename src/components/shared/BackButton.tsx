"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  href,
  label = "Back",
  className = "",
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 
        text-sm text-white/50 hover:text-white 
        transition-colors mb-6
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </motion.button>
  );
};

export default BackButton;
