"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";

type BillingPlan = {
  id: "free" | "pro" | "premium";
  name: string;
  priceUsd: number;
  billingCycle: string;
  usersLimit: number | null;
  tokensLimit: number | null;
  badge: string;
  features: string[];
};

type MySubscription = {
  planId: "free" | "pro" | "premium";
  planName: string;
  status: string;
  usersLimit: number | null;
  tokensLimit: number | null;
  stripeCustomerId: string | null;
  lastPaymentAt: string | null;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

const resolveApiBase = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;
};

export default function BillingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [notice, setNotice] = useState<string>("");

  const userId = useMemo(() => {
    if (!params) return "";
    const rawId = (params as { id?: string | string[] })?.id;
    return Array.isArray(rawId) ? rawId[0] : rawId || "";
  }, [params]);

  const fetchBillingData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const apiBase = resolveApiBase();
      const token = localStorage.getItem("authToken");

      const [plansResponse, subscriptionResponse] = await Promise.all([
        fetch(`${apiBase}/billing/plans`),
        fetch(`${apiBase}/billing/subscription`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const plansData = await plansResponse.json();
      const subscriptionData = await subscriptionResponse.json();

      if (!plansResponse.ok || !plansData?.success) {
        throw new Error(plansData?.message || "Unable to load plans");
      }

      if (!subscriptionResponse.ok || !subscriptionData?.success) {
        throw new Error(
          subscriptionData?.message || "Unable to load subscription",
        );
      }

      setPlans(plansData.data || []);
      setSubscription(subscriptionData.data || null);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load billing details",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkCheckoutSession = async (sessionId: string) => {
    try {
      setIsCheckingSession(true);
      const apiBase = resolveApiBase();
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${apiBase}/billing/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (
        response.ok &&
        result?.success &&
        result?.data?.paymentStatus === "paid"
      ) {
        setNotice("Payment successful. Your subscription is now active.");
        await fetchBillingData();
      } else if (response.ok && result?.data?.paymentStatus === "unpaid") {
        setNotice("Checkout was created but payment is not completed yet.");
      }
    } catch {
      setNotice(
        "Payment status will refresh automatically after Stripe confirmation.",
      );
    } finally {
      setIsCheckingSession(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const cancelled = searchParams.get("checkout");

    if (cancelled === "cancelled") {
      setNotice("Checkout cancelled. No charges were made.");
    }

    if (sessionId) {
      checkCheckoutSession(sessionId);
    }
  }, [searchParams]);

  const handlePlanCheckout = async (planId: string) => {
    try {
      setError("");
      setActivePlanId(planId);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please sign in again to continue.");
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }

      const apiBase = resolveApiBase();
      const response = await fetch(
        `${apiBase}/billing/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId,
            successUrl: `${window.location.origin}/u/${userId}/billing?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/u/${userId}/billing?checkout=cancelled`,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to create checkout session.",
        );
      }

      const redirectResult = await stripe.redirectToCheckout({
        sessionId: result.data.sessionId,
      });

      if (redirectResult.error) {
        throw new Error(redirectResult.error.message);
      }
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setActivePlanId(null);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen relative",
        isDark ? "bg-neutral-950" : "bg-neutral-50",
      )}
    >
      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 -z-10 pointer-events-none",
          isDark ? "opacity-[0.02]" : "opacity-[0.5]",
        )}
        style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={`/u/${userId}`}
          className={cn(
            "inline-flex items-center gap-2 text-sm transition-colors mb-8",
            isDark
              ? "text-white/50 hover:text-white"
              : "text-neutral-500 hover:text-neutral-900",
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
          <h1
            className={cn(
              "text-3xl font-bold mb-2",
              isDark ? "text-white" : "text-neutral-900",
            )}
          >
            Billing & Plans
          </h1>
          <p className={isDark ? "text-white/50" : "text-neutral-500"}>
            Manage Stripe payments and choose the plan that fits your team
          </p>
        </motion.div>

        {(notice || isCheckingSession || error) && (
          <div
            className={cn(
              "mb-6 p-4 rounded-xl border text-sm",
              error
                ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
            )}
          >
            {isCheckingSession
              ? "Verifying payment with Stripe..."
              : error || notice}
          </div>
        )}

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-6 rounded-2xl border mb-6",
            isDark
              ? "bg-white/[0.02] border-white/[0.06]"
              : "bg-white border-neutral-200",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={cn(
                      "text-lg font-semibold",
                      isDark ? "text-white" : "text-neutral-900",
                    )}
                  >
                    {subscription?.planName || "Free"} Plan
                  </h2>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {subscription?.status || "active"}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-white/40" : "text-neutral-500",
                  )}
                >
                  {subscription?.planId === "pro"
                    ? "$100/month"
                    : subscription?.planId === "premium"
                      ? "$200/month"
                      : "$0/month"}
                </p>
              </div>
            </div>
            <Button
              onClick={fetchBillingData}
              variant="outline"
              className={cn(
                isDark
                  ? "border-white/10 text-white/80 hover:bg-white/[0.05]"
                  : "border-neutral-300 text-neutral-700",
              )}
            >
              Refresh Status
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div
              className={cn(
                "flex items-center gap-2",
                isDark ? "text-white/70" : "text-neutral-600",
              )}
            >
              <Check className="w-4 h-4 text-emerald-400" />
              {subscription?.usersLimit === null
                ? "Unlimited users"
                : `Up to ${subscription?.usersLimit || 5} users`}
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                isDark ? "text-white/70" : "text-neutral-600",
              )}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              {subscription?.tokensLimit === null
                ? "Unlimited tokens"
                : `${subscription?.tokensLimit || 25} tokens`}
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                isDark ? "text-white/70" : "text-neutral-600",
              )}
            >
              <Crown className="w-4 h-4 text-emerald-400" />
              Stripe secured checkout
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {isLoading ? (
            <div
              className={cn(
                "col-span-full text-sm",
                isDark ? "text-white/60" : "text-neutral-600",
              )}
            >
              Loading plans...
            </div>
          ) : (
            plans.map((plan) => {
              const isCurrentPlan = subscription?.planId === plan.id;
              const isPaidPlan = plan.id !== "free";

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative p-6 rounded-2xl border transition-all",
                    isCurrentPlan
                      ? "border-emerald-500/60 bg-emerald-500/5"
                      : isDark
                        ? "border-white/[0.08] bg-white/[0.02]"
                        : "border-neutral-200 bg-white",
                  )}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className={cn(
                        "text-xl font-semibold",
                        isDark ? "text-white" : "text-neutral-900",
                      )}
                    >
                      {plan.name}
                    </h3>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full border",
                        isCurrentPlan
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                          : "bg-violet-500/10 text-violet-300 border-violet-500/30",
                      )}
                    >
                      {isCurrentPlan ? "Current" : plan.badge}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p
                      className={cn(
                        "text-4xl font-bold",
                        isDark ? "text-white" : "text-neutral-900",
                      )}
                    >
                      {plan.priceUsd === 0 ? "$0" : `$${plan.priceUsd}`}
                    </p>
                    <p
                      className={cn(
                        "text-sm mt-1",
                        isDark ? "text-white/50" : "text-neutral-500",
                      )}
                    >
                      per {plan.billingCycle}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "text-xs mb-4",
                      isDark ? "text-white/60" : "text-neutral-600",
                    )}
                  >
                    {plan.usersLimit === null
                      ? "Unlimited users"
                      : `Up to ${plan.usersLimit} users`}{" "}
                    ·{" "}
                    {plan.tokensLimit === null
                      ? "Unlimited tokens"
                      : `${plan.tokensLimit} tokens`}
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className={cn(
                          "flex items-start gap-2 text-sm",
                          isDark ? "text-white/75" : "text-neutral-700",
                        )}
                      >
                        <Check className="w-4 h-4 mt-0.5 text-emerald-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={cn(
                      "w-full",
                      isCurrentPlan
                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                        : isPaidPlan
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                    )}
                    disabled={isCurrentPlan || activePlanId === plan.id}
                    onClick={() => {
                      if (!isCurrentPlan && isPaidPlan) {
                        handlePlanCheckout(plan.id);
                      }
                    }}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : activePlanId === plan.id
                        ? "Redirecting..."
                        : isPaidPlan
                          ? `Choose ${plan.name}`
                          : "Start Free"}
                  </Button>
                </div>
              );
            })
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
            <p className="text-sm font-medium text-amber-300">Plan Summary</p>
            <p className="text-xs text-amber-200/60 mt-1">
              Free includes Task Generator + core AI support. Pro enables
              Sprint, Task, Doc, and Blocker agents with limited tokens. Premium
              unlocks all agents with unlimited users and unlimited tokens.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
