"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/sections/Footer";
import {
  Target,
  Users,
  Zap,
  Shield,
  Lightbulb,
  TrendingUp,
  Heart,
  Award,
} from "lucide-react";
import Logo from "@/components/shared/Logo";

const stats = [
  { label: "Teams Empowered", value: "500+", icon: Users },
  { label: "Tasks Automated", value: "50K+", icon: Zap },
  { label: "Time Saved", value: "10K+ hrs", icon: TrendingUp },
  { label: "Customer Rating", value: "4.9/5", icon: Award },
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're on a mission to eliminate project management chaos and help teams focus on what truly matters - building great products.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We leverage cutting-edge AI to transform how teams plan, execute, and deliver projects. Smart automation, not busy work.",
  },
  {
    icon: Users,
    title: "Team-Centric",
    description:
      "Every feature we build is designed to make team collaboration seamless, transparent, and dare we say, enjoyable.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Your data is sacred. We employ enterprise-grade security to protect your projects and team information.",
  },
];

const team = [
  {
    name: "The Vision",
    role: "What Drives Us",
    description:
      "We believe project management should be intelligent, intuitive, and invisible. Nexa exists to make that vision a reality for every team.",
  },
  {
    name: "The Technology",
    role: "How We Deliver",
    description:
      "Powered by advanced AI and machine learning, Nexa learns from your team's patterns to predict, plan, and optimize automatically.",
  },
  {
    name: "The Community",
    role: "Who We Serve",
    description:
      "From startups to enterprises, we serve teams who refuse to settle for outdated, manual project management tools.",
  },
];

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a0f]" : "bg-white"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md mb-8 ${
          isDark
            ? "bg-[#0a0a0f]/80 border-b border-white/5"
            : "bg-white/80 border-b border-neutral-200"
        }`}
      >
        <div className="mx-auto max-w-4xl p-4">
          <Header />
        </div>
      </header>

      <main className="px-4 sm:px-8 pb-16">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
              About Nexa
            </span>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Redefining How Teams
              <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Manage Projects
              </span>
            </h1>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Nexa is an AI-powered project management platform that automates
              the tedious, surfaces the important, and helps your team deliver
              faster than ever.
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="max-w-5xl mx-auto py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group p-6 rounded-2xl text-center transition-colors ${
                  isDark
                    ? "bg-neutral-900/40 border border-white/[0.06] hover:border-white/[0.12]"
                    : "bg-neutral-50 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-violet-400" />
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-white/50" : "text-neutral-500"
                  }`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-6xl mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Our Core Values
            </h2>
            <p
              className={`max-w-xl mx-auto ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              The principles that guide everything we build and every decision
              we make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`p-6 rounded-2xl transition-colors ${
                  isDark
                    ? "bg-neutral-900/40 border border-white/[0.06] hover:border-white/[0.12]"
                    : "bg-neutral-50 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {value.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? "text-white/60" : "text-neutral-600"
                      }`}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-5xl mx-auto py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`p-6 rounded-2xl transition-colors ${
                  isDark
                    ? "bg-gradient-to-b from-neutral-900/60 to-neutral-900/20 border border-white/[0.06] hover:border-violet-500/20"
                    : "bg-gradient-to-b from-neutral-50 to-white border border-neutral-200 hover:border-violet-500/30"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {item.name}
                </h3>
                <p className="text-violet-400 text-sm mb-3">{item.role}</p>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20"
          >
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Ready to Transform Your Workflow?
            </h2>
            <p
              className={`mb-8 max-w-lg mx-auto ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Join thousands of teams who've already discovered a smarter way to
              manage projects.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium hover:from-violet-600 hover:to-violet-700 transition-all"
            >
              Get Started Free
              <Zap className="w-4 h-4" />
            </a>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-8">
        <Footer />
      </footer>
    </div>
  );
}
