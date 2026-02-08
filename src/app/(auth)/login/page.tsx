// app/(auth)/login/page.tsx
"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations/stagger";
import { LOGIN_FIELDS } from "@/lib/constants/auth/authConstants";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { SocialButtons } from "@/components/auth/AuthButtons";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { useRegisterUserMutation } from "@/api/auth/authApi";
import { useTheme } from "next-themes";

// Login page component
const LoginPage = () => {
  const [registerUser] = useRegisterUserMutation();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const { email } = values;
      const resp = await registerUser({ email });
      if (resp.data) {
        localStorage.setItem("emailForSignIn", email);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  // 💡 The submit button text should be "Submit" for the login form

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-4 px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[460px] flex flex-col items-center gap-4"
      >
        <AuthCard
          title="Sign in to NEXA"
          subtitle="Choose a method to continue"
        >
          <div className="space-y-4">
            <SocialButtons className="my-2" providers={["slack", "google"]} />
            <AuthDivider text="Or sign in with email" />
            <AuthForm
              fields={LOGIN_FIELDS}
              onSubmit={handleSubmit}
              submitButtonText="Submit"
            />

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm pt-1 text-center leading-snug">
              <button
                type="button"
                className={`transition-colors underline-offset-4 hover:underline ${
                  isDark
                    ? "text-white/75 hover:text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Use passkey instead
              </button>
              <span
                className={
                  isDark ? "text-white/30" : "text-neutral-300"
                }
                aria-hidden
              >
                •
              </span>
              <AuthFooter
                text="Don't have an account?"
                linkText="Register"
                href="/register"
                className="pt-0"
              />
            </div>
          </div>
        </AuthCard>
      </motion.div>
    </div>
  );
};

export default LoginPage;
