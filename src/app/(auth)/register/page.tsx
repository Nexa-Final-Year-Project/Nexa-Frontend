// app/(auth)/register/page.tsx
"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations/stagger";
import { EMAIL_VERIFICATION_FIELDS } from "@/lib/constants/auth/authConstants";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialButtons } from "@/components/auth/AuthButtons";
import { useRegisterUserMutation } from "@/api/auth/authApi";
import { useTheme } from "next-themes";

const RegisterPage = () => {
  const [registerUser] = useRegisterUserMutation();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-4 px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[460px] flex flex-col items-center gap-4"
      >
        <AuthCard
          title="Create your account"
          subtitle="Select a sign up method to get started"
        >
          <div className="space-y-4">
            <SocialButtons
              className="my-2"
              providers={["google", "slack", "github"]}
            />
            <AuthDivider text="Or continue with email" />
            <AuthForm
              fields={EMAIL_VERIFICATION_FIELDS}
              onSubmit={handleSubmit}
              submitButtonText="Create account"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm pt-1 text-center">
              <span className={isDark ? "text-white/60" : "text-neutral-600"}>
                No credit card required
              </span>
              <span className={isDark ? "text-white/20" : "text-neutral-300"}>
                •
              </span>
              <AuthFooter
                text="Already have an account?"
                linkText="Sign in"
                href="/login"
                className="pt-0"
              />
            </div>
          </div>
        </AuthCard>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
