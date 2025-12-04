"use client";

import React, { useState } from "react";
import Header from "@/components/shared/Header/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Book,
  MessageSquare,
  Mail,
  ChevronDown,
  Search,
  Zap,
  Users,
  Settings,
  Folder,
  CheckSquare,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    category: "Getting Started",
    icon: Zap,
    questions: [
      {
        q: "How do I create my first project?",
        a: "Navigate to the Dashboard and click the 'New Project' button. Fill in the project name, description, and invite team members to get started.",
      },
      {
        q: "How do I invite team members?",
        a: "Open your project settings, go to the 'Members' tab, and enter the email addresses of the people you want to invite. They'll receive an invitation email.",
      },
      {
        q: "What's the difference between tasks and sprints?",
        a: "Tasks are individual work items, while sprints are time-boxed periods (usually 1-2 weeks) where you complete a set of tasks. Sprints help organize work into manageable chunks.",
      },
    ],
  },
  {
    category: "Projects & Tasks",
    icon: Folder,
    questions: [
      {
        q: "How do I organize tasks within a project?",
        a: "You can organize tasks using the Board view (Kanban-style), List view, or Timeline view. Drag and drop tasks between columns or assign them to sprints.",
      },
      {
        q: "Can I set task dependencies?",
        a: "Yes! When editing a task, you can link it to other tasks as dependencies. This helps visualize the workflow and prevent bottlenecks.",
      },
      {
        q: "How does the AI task generation work?",
        a: "Our AI analyzes your project description and generates suggested tasks. You can review, edit, and approve these suggestions before adding them to your project.",
      },
    ],
  },
  {
    category: "Team Collaboration",
    icon: Users,
    questions: [
      {
        q: "How do I assign tasks to team members?",
        a: "Open a task and use the 'Assignee' field to select team members. You can assign multiple people to a single task if needed.",
      },
      {
        q: "Can I mention team members in comments?",
        a: "Yes! Use @username in comments to mention team members. They'll receive a notification about your mention.",
      },
      {
        q: "How do notifications work?",
        a: "You'll receive notifications for task assignments, mentions, due date reminders, and project updates. Customize your preferences in Settings.",
      },
    ],
  },
  {
    category: "Account & Settings",
    icon: Settings,
    questions: [
      {
        q: "How do I change my password?",
        a: "Go to Settings > Account > Security and click 'Change Password'. You'll need to enter your current password and your new password.",
      },
      {
        q: "Can I export my project data?",
        a: "Yes! Go to Project Settings > Export and choose your preferred format (JSON, CSV, or PDF). All your tasks, comments, and history will be included.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings > Account > Danger Zone and click 'Delete Account'. This action is irreversible and will delete all your data.",
      },
    ],
  },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-white/[0.06] last:border-b-0"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-white/80 group-hover:text-white transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-white/50 text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter FAQs based on search
  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-20 bg-neutral-950" />
      <div 
        className="fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Header />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
            <HelpCircle className="w-8 h-8 text-white/60" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-white/30 focus:outline-none focus:border-white/10 transition-colors"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
        >
          {[
            {
              icon: Book,
              title: "Documentation",
              description: "Detailed guides and tutorials",
              href: "/docs",
            },
            {
              icon: MessageSquare,
              title: "Community",
              description: "Join discussions with other users",
              href: "/community",
            },
            {
              icon: Mail,
              title: "Contact Support",
              description: "Get help from our team",
              href: "/contact",
            },
          ].map((item, index) => (
            <Link key={index} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all group cursor-pointer"
              >
                <item.icon className="w-6 h-6 text-white/40 mb-4 group-hover:text-white/60 transition-colors" />
                <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                  {item.title}
                  <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                </h3>
                <p className="text-sm text-white/40">{item.description}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* FAQ Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {(searchQuery ? filteredFaqs : faqs).map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.category
                        ? null
                        : category.category
                    )
                  }
                  className="w-full flex items-center gap-4 p-6 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-white/50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{category.category}</h3>
                    <p className="text-sm text-white/40">
                      {category.questions.length} questions
                    </p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: activeCategory === category.category ? 180 : 0,
                    }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/30" />
                  </motion.div>
                </button>

                {/* Questions */}
                <AnimatePresence>
                  {(activeCategory === category.category || searchQuery) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        {category.questions.map((q, qIndex) => (
                          <FAQItem
                            key={qIndex}
                            question={q.q}
                            answer={q.a}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Still need help? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Still need help?
          </h3>
          <p className="text-white/50 mb-6">
            Our support team is here to help you with any questions.
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-medium rounded-xl hover:bg-white/90 transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
