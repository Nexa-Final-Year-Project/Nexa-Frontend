"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Receipt,
  Download,
  Calendar,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Mock billing data
const currentPlan = {
  name: "Free",
  price: "$0",
  billingCycle: "forever",
  features: ["3 Projects", "5 Team Members", "Basic Analytics", "Email Support"],
};

const invoices = [
  { id: "INV-001", date: "Dec 1, 2024", amount: "$0.00", status: "Paid" },
  { id: "INV-002", date: "Nov 1, 2024", amount: "$0.00", status: "Paid" },
  { id: "INV-003", date: "Oct 1, 2024", amount: "$0.00", status: "Paid" },
];

const paymentMethods = [
  { type: "card", last4: "4242", brand: "Visa", expiry: "12/26" },
];

export default function BillingPage() {
  const params = useParams();
  const [showAddCard, setShowAddCard] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("min-h-screen", isDark ? "bg-neutral-950" : "bg-neutral-50")}>
      {/* Background */}
      <div 
        className={cn("fixed inset-0 -z-10", isDark ? "opacity-[0.02]" : "opacity-[0.5]")}
        style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href={`/u/${params.userId}`}
          className={cn(
            "inline-flex items-center gap-2 text-sm transition-colors mb-8",
            isDark ? "text-white/50 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-neutral-900")}>Billing & Plans</h1>
          <p className={isDark ? "text-white/50" : "text-neutral-500"}>Manage your subscription and payment methods</p>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-6 rounded-2xl border mb-6",
            isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-neutral-200"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>{currentPlan.name} Plan</h2>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className={cn("text-sm", isDark ? "text-white/40" : "text-neutral-500")}>{currentPlan.price}/{currentPlan.billingCycle}</p>
              </div>
            </div>
            <Link href={`/u/${params.userId}/upgrade`}>
              <Button className={cn(
                isDark ? "bg-white text-neutral-900 hover:bg-white/90" : "bg-neutral-900 text-white hover:bg-neutral-800"
              )}>
                Upgrade Plan
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className={cn("flex items-center gap-2 text-sm", isDark ? "text-white/60" : "text-neutral-600")}>
                <Check className="w-4 h-4 text-emerald-400" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-6 rounded-2xl border mb-6",
            isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-neutral-200"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className={cn("w-5 h-5", isDark ? "text-white/40" : "text-neutral-500")} />
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>Payment Methods</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                isDark 
                  ? "border-white/10 text-white/70 hover:bg-white/[0.04]" 
                  : "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              )}
              onClick={() => setShowAddCard(true)}
            >
              Add Card
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="py-8 text-center">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                isDark ? "bg-white/[0.03]" : "bg-neutral-100"
              )}>
                <CreditCard className={cn("w-6 h-6", isDark ? "text-white/20" : "text-neutral-300")} />
              </div>
              <p className={cn("text-sm mb-1", isDark ? "text-white/50" : "text-neutral-500")}>No payment methods</p>
              <p className={cn("text-xs", isDark ? "text-white/30" : "text-neutral-400")}>Add a card to enable paid features</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border",
                    isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-neutral-50 border-neutral-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isDark ? "bg-white/[0.04]" : "bg-neutral-100"
                    )}>
                      <CreditCard className={cn("w-5 h-5", isDark ? "text-white/50" : "text-neutral-500")} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-white/40" : "text-neutral-500")}>Expires {method.expiry}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className={cn(isDark ? "text-white/40" : "text-neutral-400", "hover:text-rose-400")}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-6 rounded-2xl border",
            isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-neutral-200"
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Receipt className={cn("w-5 h-5", isDark ? "text-white/40" : "text-neutral-500")} />
            <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>Billing History</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="py-8 text-center">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                isDark ? "bg-white/[0.03]" : "bg-neutral-100"
              )}>
                <Receipt className={cn("w-6 h-6", isDark ? "text-white/20" : "text-neutral-300")} />
              </div>
              <p className={cn("text-sm", isDark ? "text-white/50" : "text-neutral-500")}>No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-colors",
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isDark ? "bg-white/[0.03]" : "bg-neutral-100"
                    )}>
                      <Calendar className={cn("w-5 h-5", isDark ? "text-white/30" : "text-neutral-400")} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>{invoice.id}</p>
                      <p className={cn("text-xs", isDark ? "text-white/40" : "text-neutral-500")}>{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-sm", isDark ? "text-white/60" : "text-neutral-600")}>{invoice.amount}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400">
                      {invoice.status}
                    </span>
                    <Button variant="ghost" size="sm" className={cn(isDark ? "text-white/40 hover:text-white" : "text-neutral-400 hover:text-neutral-900")}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Usage Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Usage Reminder</p>
            <p className="text-xs text-amber-200/60 mt-1">
              You're using 2 of 3 available projects on the Free plan. Upgrade to Pro for unlimited projects.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
