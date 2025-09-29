// app/(auth)/complete-sign-in/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations/stagger";
import { useVerifyEmailLinkMutation } from "@/api/auth/authApi";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { Spinner as LoadingSpinner } from "@/components/shared/Spinner";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const CompleteSignInPage = () => {
  const router = useRouter();
  const [verifyEmailLink] = useVerifyEmailLinkMutation();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyLink = async () => {
      try {
        // Get the full URL including query parameters
        const emailLink = window.location.href;

        // Get the email from localStorage
        const storedEmail = localStorage.getItem("emailForSignIn");
        if (!storedEmail) {
          notifications.show({
            title: "Email not found",
            message: "Please request a new sign-in link",
            color: "red",
            icon: <IconX size={18} />,
          });
          throw new Error("Email not found");
        }
        setEmail(storedEmail);

        // Show verifying notification
        notifications.show({
          id: "verifying",
          title: "Verifying your sign-in",
          message: "Please wait...",
          loading: true,
          autoClose: false,
          withCloseButton: false,
        });

        // Verify the email link with the backend
        const result = await verifyEmailLink({
          email: storedEmail,
          emailLink,
        }).unwrap();

        // Clear the stored email
        localStorage.removeItem("emailForSignIn");

        // Update notification
        notifications.update({
          id: "verifying",
          title: "Success!",
          message: "Sign-in successful",
          color: "teal",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });

        setStatus("success");

        // Store the Firebase token if needed
        if (result.firebaseCustomToken) {
          localStorage.setItem("firebaseToken", result.firebaseCustomToken);
        }

        // Redirect to dashboard
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
        notifications.show({
          title: "Sign-in failed",
          message: "Invalid or expired sign-in link. Please request a new one.",
          color: "red",
          icon: <IconX size={18} />,
        });
      }
    };

    verifyLink();
  }, [router, verifyEmailLink]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <AuthCard
        title={
          status === "verifying"
            ? "Verifying your sign-in"
            : status === "success"
            ? "Sign-in successful!"
            : "Sign-in failed"
        }
        subtitle={
          status === "verifying"
            ? "Please wait while we verify your link..."
            : status === "success"
            ? `Welcome back, ${email}`
            : "The sign-in link is invalid or expired"
        }
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {status === "verifying" && <LoadingSpinner size="lg" />}
          {status === "error" && (
            <AuthFooter
              text="Need a new sign-in link?"
              linkText="Request new link"
              href="/login"
            />
          )}
        </div>
      </AuthCard>
    </motion.div>
  );
};

export default CompleteSignInPage;
