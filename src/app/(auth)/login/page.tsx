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

const LoginPage = () => {
  const [registerUser] = useRegisterUserMutation();

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
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <AuthCard title="Welcome back" subtitle="Sign in to your account">
        <div className="space-y-4">
          <SocialButtons className="my-4" />
          <AuthDivider />
          <AuthForm
            fields={LOGIN_FIELDS}
            onSubmit={handleSubmit}
            submitButtonText="Continue Playing!"
          />

          <AuthFooter
            text="Don't have an account?"
            linkText="Register"
            href="/register"
          />
        </div>
      </AuthCard>
    </motion.div>
  );
};

export default LoginPage;
