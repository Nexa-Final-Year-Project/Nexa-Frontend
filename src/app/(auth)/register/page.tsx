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

const RegisterPage = () => {
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
      <AuthCard
        title="Create an account"
        subtitle="Get started with our platform"
      >
        <div className="space-y-4">
          <SocialButtons
            className="my-4"
            providers={["google", "slack", "github"]}
          />
          <AuthDivider />
          <AuthForm
            className="dark:text-white"
            fields={EMAIL_VERIFICATION_FIELDS}
            onSubmit={handleSubmit}
            submitButtonText="Start Playing!"
          />
          <AuthFooter
            text="Already have an account?"
            linkText="Sign in"
            href="/login"
          />
        </div>
      </AuthCard>
    </motion.div>
  );
};

export default RegisterPage;
