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

// Login page component
const LoginPage = () => {
  const [registerUser] = useRegisterUserMutation();

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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-8 px-4">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 dark:block hidden" />
      <div
        className="fixed inset-0 -z-10 opacity-30 dark:block hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg flex-1 flex items-center justify-center"
      >
        <AuthCard title="Welcome back" subtitle="Sign in to your account">
          <div className="space-y-4">
            <SocialButtons className="my-4" />
            <AuthDivider />
            <AuthForm
              fields={LOGIN_FIELDS}
              onSubmit={handleSubmit}
              submitButtonText="Submit"
            />

            <AuthFooter
              text="Don't have an account?"
              linkText="Register"
              href="/register"
            />
          </div>
        </AuthCard>
      </motion.div>
    </div>
  );
};

export default LoginPage;
