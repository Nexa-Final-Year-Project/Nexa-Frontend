"use client";

import { AnimatedDiv } from "../AnimatedDiv";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const CTA = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${
        isDark
          ? "bg-neutral-900/50 border-white/[0.06]"
          : "bg-white border-neutral-200 shadow-xl"
      }`}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-3xl mx-auto text-center py-20 px-6 sm:py-24 sm:px-8">
        <AnimatedDiv variant="fade" direction="up">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border ${
              isDark
                ? "bg-white/[0.03] border-white/[0.06]"
                : "bg-neutral-100 border-neutral-300"
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            />
            <span
              className={`text-sm ${
                isDark ? "text-white/50" : "text-neutral-600"
              }`}
            >
              No credit card required
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Ready to transform your workflow?
          </h2>

          {/* Description */}
          <p
            className={`text-lg mb-10 max-w-xl mx-auto ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            Join thousands of high-performing teams already using NEXA to ship
            faster and collaborate smarter.
          </p>

          {/* Feature list */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {["14-day free trial", "Full access", "Cancel anytime"].map(
              (feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">{feature}</span>
                </div>
              )
            )}
          </div>

          {/* CTA Buttons - MINIMAL */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 font-medium rounded-xl hover:bg-white/90 transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-4 font-medium rounded-xl border transition-all ${
                  isDark
                    ? "text-white/70 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.03]"
                    : "text-neutral-700 border-neutral-300 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                Talk to Sales
              </motion.button>
            </Link>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
};

export default CTA;
