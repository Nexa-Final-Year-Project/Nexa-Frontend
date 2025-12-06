"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sparkles,
  Target,
  Users,
  Rocket,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Define Your Project",
    description:
      "Set up your project with goals, timelines, and team members. Our AI analyzes your requirements to suggest optimal workflows.",
    features: [
      "Smart project templates",
      "AI-powered scope analysis",
      "Automatic milestone creation",
    ],
    gradient: "from-violet-500 to-purple-600",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Generates Tasks",
    description:
      "Our intelligent system breaks down your project into actionable tasks, estimates effort, and identifies dependencies automatically.",
    features: [
      "Intelligent task breakdown",
      "Effort estimation",
      "Dependency mapping",
    ],
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    number: "03",
    icon: Users,
    title: "Smart Assignment",
    description:
      "Tasks are matched to team members based on skills, availability, and past performance for optimal resource allocation.",
    features: [
      "Skill-based matching",
      "Workload balancing",
      "Performance analytics",
    ],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Track & Deliver",
    description:
      "Monitor progress in real-time, receive smart nudges, and deliver projects on time with predictive insights.",
    features: [
      "Real-time dashboards",
      "Predictive alerts",
      "Sprint automation",
    ],
    gradient: "from-amber-500 to-orange-600",
  },
];

const HowItWorks = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/60 mb-6"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            Simple Process
          </motion.span>

          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              NEXA
            </span>{" "}
            Works
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            From idea to delivery in four simple steps. Let AI handle the
            complexity while you focus on what matters.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div
                  className={`relative p-6 rounded-2xl border h-full transition-all duration-300 hover:scale-[1.02] group ${
                    isDark
                      ? "bg-neutral-900/50 border-white/[0.06] hover:border-white/[0.12]"
                      : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xl"
                  }`}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />

                  {/* Number badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-5xl font-bold ${
                        isDark ? "text-white/[0.06]" : "text-neutral-100"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${step.gradient}`}
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm mb-5 ${
                      isDark ? "text-white/50" : "text-neutral-600"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-sm ${
                          isDark ? "text-white/40" : "text-neutral-500"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 bg-gradient-to-br ${step.gradient} text-transparent bg-clip-text`}
                          style={{ stroke: "url(#gradient)" }}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Arrow connector (visible on larger screens) */}
                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block z-10">
                      <ArrowRight
                        className={`w-8 h-8 ${
                          isDark ? "text-white/10" : "text-neutral-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
