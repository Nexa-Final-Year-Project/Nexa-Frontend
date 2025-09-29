"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/theme/ThemeToggle";

import Menu from "./Menu";
import Logo from "../Logo";
import { Button } from "@/components/ui/button/Button";

const Header = () => {
  return (
    <motion.nav className="rounded-4xl shadow-gray-600 shadow-sm px-10 py-3 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-16">
          <Logo />
        </div>
        {
          <div className="hidden md:block">
            <Menu />
          </div>
        }
        <div className="flex items-center space-x-4">
          {
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              <Button variant="outline" color="var(--stone-cable)">
                <span className="text-foreground">Login</span>
              </Button>
            </Link>
          }
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
