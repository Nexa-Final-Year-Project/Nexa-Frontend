// hooks/auth/useHandleLoginSuccess.ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth/authStore";
import { redirectAfterLogin } from "@/lib/utils/redirect";

export function useHandleLoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore(); // assuming you have this

  return (user: any) => {
    setUser(user); // central auth update
    redirectAfterLogin(router, searchParams);
  };
}
