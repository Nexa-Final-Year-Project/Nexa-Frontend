"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  Activity,
  Zap
} from "lucide-react";

const stats = [
  { value: "47%", label: "Faster Delivery", description: "Average improvement in project delivery time" },
  { value: "3.2x", label: "Team Productivity", description: "Increase in tasks completed per sprint" },
  { value: "89%", label: "Accuracy", description: "AI estimation accuracy for story points" },
  { value: "62%", label: "Less Meetings", description: "Reduction in status update meetings" }
];

const metrics = [
  { icon: BarChart3, label: "Sprint Velocity", value: "+34%", trend: "up" },
  { icon: LineChart, label: "On-Time Delivery", value: "94%", trend: "up" },
  { icon: PieChart, label: "Resource Utilization", value: "87%", trend: "up" },
  { icon: Activity, label: "Team Health Score", value: "9.2", trend: "stable" }
];

const Stats = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#0a0a0f] via-violet-950/10 to-[#0a0a0f]" : "bg-gradient-to-b from-white via-violet-50/50 to-white"}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/60 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Proven Results
          </motion.span>
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
            Numbers that <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Speak</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/50" : "text-neutral-600"}`}>
            Real metrics from teams using NEXA to transform their project management workflow.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border text-center group transition-all duration-300 hover:scale-[1.02] ${
                isDark 
                  ? "bg-neutral-900/50 border-white/[0.06] hover:border-white/[0.12]"
                  : "bg-white border-neutral-200 hover:shadow-lg"
              }`}
            >
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text mb-2"
              >
                {stat.value}
              </motion.div>
              <div className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-neutral-900"}`}>
                {stat.label}
              </div>
              <div className={`text-sm ${isDark ? "text-white/40" : "text-neutral-500"}`}>
                {stat.description}
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Live Metrics Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative p-8 rounded-3xl border overflow-hidden ${
            isDark 
              ? "bg-neutral-900/70 border-white/[0.06]"
              : "bg-white border-neutral-200 shadow-xl"
          }`}
        >
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-neutral-500"}`}>
                  Live Dashboard Preview
                </span>
              </div>
              <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
                Real-Time Analytics at Your Fingertips
              </h3>
              <p className={`${isDark ? "text-white/50" : "text-neutral-600"}`}>
                Monitor your team's performance with beautiful, actionable dashboards that update in real-time.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 w-full md:w-auto">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    isDark 
                      ? "bg-white/[0.02] border-white/[0.06]"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className={`w-4 h-4 ${isDark ? "text-white/40" : "text-neutral-400"}`} />
                    <span className={`text-xs ${isDark ? "text-white/40" : "text-neutral-500"}`}>{metric.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                      {metric.value}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      metric.trend === "up" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-white/10 text-white/50"
                    }`}>
                      {metric.trend === "up" ? "↑" : "→"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
