"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Layers, Zap, Shield, Clock, Globe, Infinity } from "lucide-react";
import Image from "next/image";

const integrations = [
  { name: "GitHub", logo: "/integrations/github.svg" },
  { name: "Slack", logo: "/integrations/slack.svg" },
  { name: "Jira", logo: "/integrations/jira.svg" },
  { name: "GitLab", logo: "/integrations/gitlab.svg" },
  { name: "Linear", logo: "/integrations/linear.svg" },
  { name: "Figma", logo: "/integrations/figma.svg" },
  { name: "Notion", logo: "/integrations/notion.svg" },
  { name: "VS Code", logo: "/integrations/vscode.svg" },
];

const features = [
  {
    icon: Zap,
    label: "Real-time sync",
    description: "Changes reflect instantly",
  },
  {
    icon: Shield,
    label: "Secure OAuth",
    description: "Enterprise-grade security",
  },
  { icon: Clock, label: "Auto-import", description: "Seamless data migration" },
  {
    icon: Globe,
    label: "50+ tools",
    description: "Growing integration library",
  },
];

const Integrations = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/60 mb-6"
            >
              <Layers className="w-4 h-4 text-violet-400" />
              Integrations
            </motion.span>

            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Works with your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                favorite tools
              </span>
            </h2>
            <p
              className={`text-lg mb-10 ${
                isDark ? "text-white/50" : "text-neutral-600"
              }`}
            >
              NEXA integrates seamlessly with the tools your team already uses.
              No switching tabs, no context loss — everything in one place.
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? "bg-white/[0.02] border-white/[0.06]"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                >
                  <feature.icon
                    className={`w-5 h-5 mb-2 ${
                      isDark ? "text-violet-400" : "text-violet-500"
                    }`}
                  />
                  <div
                    className={`font-medium ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {feature.label}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-white/40" : "text-neutral-500"
                    }`}
                  >
                    {feature.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Integration logos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className={`p-8 rounded-3xl border ${
                isDark
                  ? "bg-neutral-900/50 border-white/[0.06]"
                  : "bg-white border-neutral-200 shadow-xl"
              }`}
            >
              {/* Connection lines decoration */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <svg className="w-full h-full opacity-10" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient
                      id="lineGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="100"
                    y1="100"
                    x2="300"
                    y2="100"
                    stroke="url(#lineGrad)"
                    strokeWidth="1"
                  />
                  <line
                    x1="100"
                    y1="200"
                    x2="300"
                    y2="200"
                    stroke="url(#lineGrad)"
                    strokeWidth="1"
                  />
                  <line
                    x1="100"
                    y1="300"
                    x2="300"
                    y2="300"
                    stroke="url(#lineGrad)"
                    strokeWidth="1"
                  />
                  <line
                    x1="200"
                    y1="50"
                    x2="200"
                    y2="350"
                    stroke="url(#lineGrad)"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Center NEXA logo */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 20px rgba(139, 92, 246, 0.2)",
                      "0 0 40px rgba(139, 92, 246, 0.4)",
                      "0 0 20px rgba(139, 92, 246, 0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center"
                >
                  <Infinity className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              {/* Integration logos grid */}
              <div className="grid grid-cols-4 gap-4">
                {integrations.map((integration, index) => (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`aspect-square rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                      isDark
                        ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05]"
                        : "bg-neutral-50 border-neutral-200 hover:border-neutral-300 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        isDark ? "bg-white/10" : "bg-neutral-200"
                      } flex items-center justify-center`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          isDark ? "text-white/60" : "text-neutral-500"
                        }`}
                      >
                        {integration.name.slice(0, 2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                className={`text-center mt-6 text-sm ${
                  isDark ? "text-white/40" : "text-neutral-500"
                }`}
              >
                And 50+ more integrations
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
