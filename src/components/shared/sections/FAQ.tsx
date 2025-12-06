"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How does NEXA's AI task generation work?",
    answer:
      "NEXA analyzes your project requirements, user stories, and historical data to automatically generate tasks with estimated effort, priorities, and dependencies. The AI learns from your team's patterns to improve accuracy over time.",
  },
  {
    question: "Can I integrate NEXA with my existing tools?",
    answer:
      "Yes! NEXA integrates seamlessly with GitHub, GitLab, Slack, Jira, Linear, and 50+ other tools. We also provide a REST API and webhooks for custom integrations.",
  },
  {
    question: "Is my data secure with NEXA?",
    answer:
      "Absolutely. We use enterprise-grade security with SOC 2 Type II compliance, end-to-end encryption, and regular security audits. Your data is stored in isolated environments with 99.99% uptime SLA.",
  },
  {
    question: "How is NEXA different from other project management tools?",
    answer:
      "NEXA is AI-native, not AI-added. Our entire platform is built around intelligent automation - from task generation to sprint planning to resource allocation. We predict problems before they happen.",
  },
  {
    question: "What size teams is NEXA best for?",
    answer:
      "NEXA scales from small startups (5+ members) to large enterprises (1000+ members). Our pricing and features adapt to your team size, and you only pay for what you use.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! Start with our 14-day free trial with full access to all features. No credit card required. We also have a generous free tier for small teams getting started.",
  },
];

const FAQ = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            FAQ
          </motion.span>

          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              Questions
            </span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            Everything you need to know about NEXA. Can't find the answer you're
            looking for? Reach out to our team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isDark
                  ? "bg-neutral-900/50 border-white/[0.06] hover:border-white/[0.12]"
                  : "bg-white border-neutral-200 hover:border-neutral-300"
              } ${
                openIndex === index
                  ? isDark
                    ? "border-violet-500/30"
                    : "border-violet-300"
                  : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    className={`w-5 h-5 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-6 pb-5 ${
                        isDark ? "text-white/60" : "text-neutral-600"
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-12 p-8 rounded-2xl border text-center ${
            isDark
              ? "bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border-white/[0.08]"
              : "bg-gradient-to-br from-violet-50 to-cyan-50 border-neutral-200"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-3 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Still have questions?
          </h3>
          <p
            className={`text-sm mb-6 ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/help"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 font-medium hover:bg-white/90 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Visit Help Center
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="mailto:support@nexa.app"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition-all ${
                isDark
                  ? "border-white/10 text-white/70 hover:bg-white/[0.03]"
                  : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
