"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { useAuthStore } from "@/store/auth/authStore";
import {
  LogIn,
  LayoutDashboard,
  ArrowRight,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import Menu from "./Menu";
import Logo from "../Logo";

const Header = () => {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isLoggedIn = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      className={cn(
        "rounded-3xl border backdrop-blur-xl px-4 sm:px-6 py-3",
        isDark
          ? "bg-neutral-900/60 border-white/[0.06]"
          : "bg-white/80 border-neutral-200/80"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Desktop Menu - Centered */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
          <Menu />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            // Hide primary dashboard pill on small screens (available in mobile drawer)
            <Link href={`/u/${user?.uid}`} className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 overflow-hidden transition-all duration-300 min-w-0",
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
            // Hide primary sign-in pill on small screens (available in mobile drawer)
            <Link href="/login" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all duration-300 backdrop-blur-sm min-w-0",
                  isDark
                    ? "bg-white/[0.08] border-white/[0.1] hover:bg-white/[0.12] hover:border-white/[0.15] text-white"
                    : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-white"
                )}
              >
                <LogIn
                  className={cn(
                    "w-4 h-4 group-hover:text-white transition-colors",
                    isDark ? "text-white/70" : "text-white/80"
                  )}
                />
                <span>Sign In</span>
              </motion.button>
            </Link>
          )}
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isDark
                ? "hover:bg-white/10 text-white"
                : "hover:bg-neutral-100 text-neutral-900"
            )}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "lg:hidden mt-4 pt-4 border-t",
              isDark ? "border-white/10" : "border-neutral-200"
            )}
          >
            <Menu mobile onItemClick={() => setMobileMenuOpen(false)} />
            <div className="mt-3 flex flex-col gap-2">
              {isLoggedIn ? (
                <Link href={`/u/${user?.uid}`} onClick={() => setMobileMenuOpen(false)}>
                  <button
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2",
                      isDark
                        ? "bg-white text-neutral-900"
                        : "bg-neutral-900 text-white"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border",
                      isDark
                        ? "bg-white/[0.08] border-white/[0.12] text-white"
                        : "bg-neutral-900 border-neutral-800 text-white"
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Header;
