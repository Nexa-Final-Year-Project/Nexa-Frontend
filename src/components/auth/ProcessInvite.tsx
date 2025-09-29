"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/projects/useProjects";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

const ProcessInvite = ({ token }: { token?: string }) => {
  const router = useRouter();
  const { acceptProjectInvite } = useProjects();
  const { user } = useAuthStore();
  const { setNext } = useAuthRedirect();

  useEffect(() => {
    if (!token) {
      router.push("/login?error=oauth_failed");
      return;
    }
    if (!user) {
      router.push(`/login?next=/invite?token=${token}`);
      setNext(`/invite?token=${token}`);
      return;
    }

    const processInvite = async () => {
      try {
        await acceptProjectInvite(token);
        router.push(`/u/${user.uid}`);
      } catch {
        router.push("/login?error=invite_invalid");
      }
    };

    processInvite();
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
