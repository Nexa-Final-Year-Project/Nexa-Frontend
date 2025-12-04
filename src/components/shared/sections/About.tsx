"use client";

import { AnimatedDiv } from "../AnimatedDiv";
import SectionWrapper from "./SectionWrapper";
import { useTheme } from "next-themes";
import {
  Brain,
  Activity,
  Bell,
  Plug,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Driven Automation",
    description: "Intelligent task assignment and sprint planning that learns from your team's patterns",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Live dashboards with instant updates on team progress and project health",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Bell,
    title: "Smart Nudges",
    description: "Proactive reminders and alerts before deadlines slip or blockers arise",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Plug,
    title: "Seamless Integrations",
    description: "Connect with GitHub, Slack, Jira, and 50+ tools your team already uses",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Deep insights into team velocity, estimation accuracy, and delivery trends",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Built-in communication tools with context-aware threads and mentions",
    gradient: "from-indigo-500 to-violet-600",
  },
];

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <div className="relative mt-16">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <AnimatedDiv
            key={feature.title}
            variant="fade"
            direction="up"
            delay={index * 0.1}
            className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              isDark
                ? "bg-neutral-900/50 border-white/10 hover:border-white/20 hover:bg-neutral-900/70"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-lg"
            }`}
          >
            {/* Gradient hover effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            {/* Icon */}
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}>
              {feature.title}
            </h3>
            <p className={`text-sm leading-relaxed ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
              {feature.description}
            </p>

            {/* Corner accent */}
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-60`} />
          </AnimatedDiv>
        ))}
      </div>

      {/* Bottom highlight */}
      <AnimatedDiv
        variant="fade"
        direction="up"
        delay={0.6}
        className={`mt-12 p-8 rounded-2xl border text-center ${
          isDark
            ? "bg-gradient-to-br from-violet-500/10 to-emerald-500/10 border-white/10"
            : "bg-gradient-to-br from-violet-50 to-emerald-50 border-neutral-200"
        }`}
      >
        <p className={`text-lg font-medium ${isDark ? "text-white" : "text-neutral-800"}`}>
          Join{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-500 font-bold">
            10,000+
          </span>{" "}
          teams already shipping faster with NEXA
        </p>
      </AnimatedDiv>
    </div>
  );
};

export default SectionWrapper(
  AboutUs,
  "About NEXA",
  "about",
  "Work Smarter, Not Harder",
  "NEXA transforms project management with AI-powered automation and real-time collaboration tools that adapt to your team's needs."
);
