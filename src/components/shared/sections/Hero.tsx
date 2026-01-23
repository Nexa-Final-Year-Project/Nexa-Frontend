"use client";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Play,
  ChevronRight,
} from "lucide-react";

const Hero = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <section className="relative max-w-7xl mx-auto pt-24 pb-16 overflow-hidden">
      {/* Subtle animated background grid */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Subtle floating orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-violet-500 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-slate-400 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-5xl mx-auto text-center px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-full border backdrop-blur-sm ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-neutral-300 bg-neutral-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span
            className={`text-sm ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            NEXA • AI Delivery OS
          </span>
        </motion.div>

        {/* Main Heading - Better proportions */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-[1.1]"
        >
          <span className={isDark ? "text-white" : "text-neutral-900"}>
            Ship every sprint with
          </span>
          <br />
          <span className="relative inline-block mt-2">
            <span
              className={`text-transparent bg-clip-text ${
                isDark
                  ? "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
                  : "bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-700"
              }`}
            >
              AI precision from NEXA
            </span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
            isDark ? "text-white/50" : "text-neutral-600"
          }`}
        >
          NEXA automates sprint planning, assignment, follow-ups, and risk
          alerts so your team ships on time without the busywork.
        </motion.p>

        {/* CTA Buttons - MINIMAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link href="/register">
            <button className="group flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 font-medium rounded-xl hover:bg-white/90 transition-all duration-300">
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link
            href="/contact?subject=demo"
            aria-label="Watch the Nexa product demo"
          >
            <button
              className={`group flex items-center gap-2 px-8 py-4 font-medium rounded-xl border transition-all duration-300 ${
                isDark
                  ? "text-white/70 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.03]"
                  : "text-neutral-700 border-neutral-300 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16"
        >
          {[
            { icon: Zap, text: "Launch workspaces in minutes" },
            { icon: Shield, text: "SOC 2-ready security controls" },
            { icon: Sparkles, text: "Human-in-the-loop AI guardrails" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className={`flex items-center gap-2 text-sm ${
                isDark ? "text-white/40" : "text-neutral-600"
              }`}
            >
              <item.icon
                className={`w-4 h-4 ${
                  isDark ? "text-white/30" : "text-neutral-500"
                }`}
              />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row - MINIMAL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl border ${
            isDark
              ? "border-white/[0.06] bg-white/[0.02]"
              : "border-neutral-300 bg-neutral-100"
          }`}
        >
          {[
            { value: "10K+", label: "Active Teams" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "2.5M+", label: "Tasks Completed" },
            { value: "150+", label: "Countries" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
            >
              <div
                className={`text-3xl md:text-4xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-white/40" : "text-neutral-600"
                }`}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
