"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/sections/Footer";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Send,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@nexa.io",
    description: "We respond within 24 hours",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
    description: "Remote-first company",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "24/7 Support",
    description: "For enterprise customers",
  },
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "Start with our free tier - up to 5 team members, unlimited projects. No credit card required. Upgrade when you're ready for more features.",
  },
  {
    question: "Can I import from other tools?",
    answer:
      "Yes! We support imports from Jira, Asana, Trello, Monday.com, and more. Our migration team can also help with custom imports.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption, SOC 2 Type II compliance, and regular security audits to protect your data.",
  },
  {
    question: "Do you offer custom integrations?",
    answer:
      "Yes, our API is fully documented and our enterprise plans include custom integration support.",
  },
];

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const apiBaseUrl = backendBaseUrl.endsWith("/api")
    ? backendBaseUrl
    : `${backendBaseUrl}/api`;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/email/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send support message.");
      }

      toast.success(result.message || "Message sent! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send support message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              Contact Us
            </span>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Let's Start a
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Have questions about Nexa? Want to schedule a demo? We'd love to
              hear from you.
            </p>
          </motion.div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-4xl mx-auto py-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-2xl text-center transition-colors border ${
                  isDark
                    ? "bg-neutral-900/40 border-white/[0.06] hover:border-white/[0.12]"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <p
                  className={`text-xs uppercase tracking-wider mb-1 ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  {info.label}
                </p>
                <p
                  className={`font-medium mb-1 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {info.value}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-white/50" : "text-neutral-600"
                  }`}
                >
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Content - Form & FAQ */}
        <section className="max-w-6xl mx-auto py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-violet-400" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Send us a message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-white/60" : "text-neutral-700"
                      }`}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                        isDark
                          ? "bg-neutral-900/60 border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:ring-violet-500/20"
                          : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500/40 focus:ring-violet-500/15"
                      }`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-white/60" : "text-neutral-700"
                      }`}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                        isDark
                          ? "bg-neutral-900/60 border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:ring-violet-500/20"
                          : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500/40 focus:ring-violet-500/15"
                      }`}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-white/60" : "text-neutral-700"
                      }`}
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                        isDark
                          ? "bg-neutral-900/60 border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:ring-violet-500/20"
                          : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500/40 focus:ring-violet-500/15"
                      }`}
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-white/60" : "text-neutral-700"
                      }`}
                    >
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:ring-1 transition-colors ${
                        isDark
                          ? "bg-neutral-900/60 border-white/[0.06] text-white focus:border-violet-500/40 focus:ring-violet-500/20"
                          : "bg-white border-neutral-300 text-neutral-900 focus:border-violet-500/40 focus:ring-violet-500/15"
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className={isDark ? "bg-neutral-900" : "bg-white"}
                      >
                        Select a topic
                      </option>
                      <option
                        value="demo"
                        className={isDark ? "bg-neutral-900" : "bg-white"}
                      >
                        Request a Demo
                      </option>
                      <option
                        value="pricing"
                        className={isDark ? "bg-neutral-900" : "bg-white"}
                      >
                        Pricing Question
                      </option>
                      <option
                        value="support"
                        className={isDark ? "bg-neutral-900" : "bg-white"}
                      >
                        Technical Support
                      </option>
                      <option
                        value="partnership"
                        className={isDark ? "bg-neutral-900" : "bg-white"}
                      >
                        Partnership
                      </option>
                      <option
                        value="other"
                        className={isDark ? "bg-neutral-900" : "bg-white"}
                      >
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 ${
                      isDark ? "text-white/60" : "text-neutral-700"
                    }`}
                  >
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors resize-none ${
                      isDark
                        ? "bg-neutral-900/60 border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:ring-violet-500/20"
                        : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500/40 focus:ring-violet-500/15"
                    }`}
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium hover:from-violet-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-xl transition-colors border ${
                      isDark
                        ? "bg-neutral-900/30 border-white/[0.04] hover:border-white/[0.08]"
                        : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <h3
                      className={`font-medium mb-2 ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? "text-white/50" : "text-neutral-600"
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional CTA */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
                <h3
                  className={`font-medium mb-2 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Need immediate help?
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-white/50" : "text-neutral-700"
                  }`}
                >
                  Check out our documentation or join our community Discord for
                  quick answers.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Browse Documentation
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-8">
        <Footer />
      </footer>
    </div>
  );
}
