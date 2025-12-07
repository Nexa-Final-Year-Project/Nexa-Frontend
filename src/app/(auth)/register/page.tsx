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
    </div>
  );
};

export default RegisterPage;
