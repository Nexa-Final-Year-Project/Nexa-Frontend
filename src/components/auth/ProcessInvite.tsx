"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/projects/useProjects";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

const ProcessInvite = ({ token }: { token?: string }) => {
  const router = useRouter();
  const { acceptProjectInvite } = useProjects();
  const { user } = useAuthStore();
  const { setNext } = useAuthRedirect();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 500;

  useEffect(() => {
    if (!token) {
      router.push("/login?error=oauth_failed");
      return;
    }

    if (!user) {
      // Store token in sessionStorage for after login
      try {
        sessionStorage.setItem("inviteToken", token);
      } catch (e) {
        console.error("Could not save invite token:", e);
      }
      router.push(`/login?next=${encodeURIComponent(`/invite?token=${token}`)}`);
      setNext(`/invite?token=${token}`);
      return;
    }

    // User is authenticated, process the invite
    const processInvite = async () => {
      try {
        const result = await acceptProjectInvite(token);
        // Success! Redirect to user dashboard
        router.push(`/u/${user.uid}`);
      } catch (error) {
        // If it fails, might be a temporary auth issue, retry
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          setTimeout(() => {
            processInvite();
          }, RETRY_DELAY_MS * retryCountRef.current);
        } else {
          console.error("Failed to accept invite after retries:", error);
          router.push("/login?error=invite_invalid");
        }
      }
    };

    // Small delay to ensure user data is fully loaded
    const timer = setTimeout(() => {
      processInvite();
    }, 100);

    return () => clearTimeout(timer);
  }, [router, token, user, acceptProjectInvite, setNext]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default ProcessInvite;
