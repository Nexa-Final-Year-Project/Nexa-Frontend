"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { useAuthStore } from "@/store/auth/authStore";
import { LogIn, LayoutDashboard, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import Menu from "./Menu";
import Logo from "../Logo";

const Header = () => {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isLoggedIn = !!user;

  return (
    <motion.nav className={cn(
      "rounded-3xl border backdrop-blur-xl px-6 py-3",
      isDark 
        ? "bg-neutral-900/60 border-white/[0.06]" 
        : "bg-white/80 border-neutral-200/80"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <Logo />
          <div className="hidden md:block">
            <Menu />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            // Show Dashboard button when logged in
            <Link href={`/u/${user?.uid}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 overflow-hidden transition-all duration-300",
                  isDark 
                    ? "bg-white text-neutral-900" 
                    : "bg-neutral-900 text-white"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>
          ) : (
            // Show Login button when not logged in - minimal elegant style
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative px-5 py-2.5 rounded-xl border font-medium text-sm flex items-center gap-2 transition-all duration-300 backdrop-blur-sm",
                  isDark 
                    ? "bg-white/[0.08] border-white/[0.1] hover:bg-white/[0.12] hover:border-white/[0.15] text-white" 
                    : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-white"
                )}
              >
                <LogIn className={cn(
                  "w-4 h-4 group-hover:text-white transition-colors",
                  isDark ? "text-white/70" : "text-white/80"
                )} />
                <span>Sign In</span>
              </motion.button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
