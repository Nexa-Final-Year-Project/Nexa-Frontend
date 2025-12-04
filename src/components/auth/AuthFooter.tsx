// components/ui/auth/AuthFooter.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type AuthFooterProps = {
  text: string;
  linkText: string;
  href: string;
  className?: string;
};

export function AuthFooter({
  text,
  linkText,
  href,
  className,
}: AuthFooterProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`text-center text-sm pt-4 ${className}`}
    >
      <span className="text-white/50">{text}</span>{" "}
      <Link 
        href={href} 
        className="text-violet-400 hover:text-violet-300 transition-colors font-medium relative group"
      >
        {linkText}
        <span className="absolute bottom-0 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
      </Link>
    </motion.div>
  );
}
