"use client";

import { useState } from "react";
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
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/5 mb-8">
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Let's Start a
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
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
                className="p-6 rounded-2xl bg-neutral-900/40 border border-white/[0.06] text-center hover:border-white/[0.12] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                  {info.label}
                </p>
                <p className="text-white font-medium mb-1">{info.value}</p>
                <p className="text-xs text-white/50">{info.description}</p>
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
                <h2 className="text-2xl font-bold text-white">
                  Send us a message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] text-white focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-neutral-900">
                        Select a topic
                      </option>
                      <option value="demo" className="bg-neutral-900">
                        Request a Demo
                      </option>
                      <option value="pricing" className="bg-neutral-900">
                        Pricing Question
                      </option>
                      <option value="support" className="bg-neutral-900">
                        Technical Support
                      </option>
                      <option value="partnership" className="bg-neutral-900">
                        Partnership
                      </option>
                      <option value="other" className="bg-neutral-900">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] text-white placeholder:text-white/30 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors resize-none"
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
              <h2 className="text-2xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-neutral-900/30 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <h3 className="font-medium text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional CTA */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
                <h3 className="font-medium text-white mb-2">
                  Need immediate help?
                </h3>
                <p className="text-sm text-white/50 mb-4">
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
