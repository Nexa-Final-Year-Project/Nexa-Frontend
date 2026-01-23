"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/sections/Footer";
import {
  Brain,
  Workflow,
  BarChart3,
  Users2,
  Calendar,
  GitBranch,
  Bell,
  Layers,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Sprint Planning",
    description:
      "Automated sprint planning powered by machine learning. Nexa analyzes your team's velocity, capacity, and historical data to create optimal sprint plans.",
    features: [
      "Auto task allocation",
      "Capacity balancing",
      "Risk prediction",
      "Timeline optimization",
    ],
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Workflow,
    title: "Intelligent Workflows",
    description:
      "Design and automate custom workflows that adapt to your team's processes. No more manual status updates or missed handoffs.",
    features: [
      "Custom automations",
      "Smart triggers",
      "Template library",
      "Process analytics",
    ],
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Real-time insights into team performance, project health, and delivery metrics. Make data-driven decisions with confidence.",
    features: [
      "Team velocity tracking",
      "Burndown charts",
      "Predictive analytics",
      "Custom dashboards",
    ],
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description:
      "Seamless communication and collaboration tools built right into your project workflow. Keep everyone aligned and informed.",
    features: [
      "Real-time updates",
      "Comment threads",
      "@mentions",
      "Activity feeds",
    ],
    gradient: "from-orange-500 to-amber-600",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Intelligent scheduling that considers team availability, dependencies, and priorities to keep your projects on track.",
    features: [
      "Dependency management",
      "Resource leveling",
      "Conflict detection",
      "Timeline views",
    ],
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: GitBranch,
    title: "Integration Hub",
    description:
      "Connect Nexa with your favorite tools. Seamless integrations with GitHub, Slack, Jira, and 50+ other platforms.",
    features: [
      "GitHub sync",
      "Slack notifications",
      "Jira import",
      "API access",
    ],
    gradient: "from-indigo-500 to-violet-600",
  },
];

const additionalFeatures = [
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "AI-filtered alerts that matter",
  },
  {
    icon: Layers,
    title: "Epic Management",
    description: "Organize large initiatives easily",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "OKRs and milestone tracking",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Keyboard shortcuts for power users",
  },
];

export default function ServicesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#0a0a0f] text-white" : "bg-white text-neutral-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md mb-8 ${
          isDark
            ? "bg-[#0a0a0f]/80 border-b border-white/5"
            : "bg-white/85 border-b border-neutral-200"
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              Our Services
            </span>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Everything You Need to
              <span className="block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Deliver Faster
              </span>
            </h1>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              From AI-powered planning to real-time analytics, Nexa provides the
              complete toolkit for modern project management.
            </p>
          </motion.div>
        </section>

        {/* Main Services Grid */}
        <section className="max-w-6xl mx-auto py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-6 rounded-2xl transition-all duration-300 border ${
                  isDark
                    ? "bg-neutral-900/40 border-white/[0.06] hover:border-white/[0.12]"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-20 flex items-center justify-center mb-5`}
                >
                  <service.icon
                    className={`w-7 h-7 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  />
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-5 ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 text-sm ${
                        isDark ? "text-white/50" : "text-neutral-600"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Additional Features */}
        <section className="max-w-5xl mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-10"
          >
            <h2
              className={`text-2xl sm:text-3xl font-bold mb-3 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Plus Many More Features
            </h2>
            <p className={isDark ? "text-white/60" : "text-neutral-600"}>
              Tools designed to boost your team's productivity
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`p-5 rounded-xl text-center transition-colors border ${
                  isDark
                    ? "bg-neutral-900/30 border-white/[0.04] hover:border-white/[0.08]"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3
                  className={`font-medium mb-1 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-white/50" : "text-neutral-600"
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="max-w-4xl mx-auto py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={
              `p-8 sm:p-12 rounded-3xl border ` +
              (isDark
                ? "bg-gradient-to-br from-cyan-500/10 to-violet-500/5 border-cyan-500/20"
                : "bg-gradient-to-br from-cyan-50 to-violet-50 border-cyan-200/60")
            }
          >
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Start Free, Scale When Ready
            </h2>
            <p
              className={`mb-8 max-w-lg mx-auto ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Try Nexa free with up to 5 team members. Upgrade anytime as your
              team grows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:from-cyan-600 hover:to-violet-600 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                  isDark
                    ? "bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.08]"
                    : "bg-neutral-100 border border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                }`}
              >
                Contact Sales
              </a>
            </div>
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
