"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";

export function useAuthRedirect(requireAuth: boolean = true) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [next, setNext] = useState<string | null>(
    () => sessionStorage.getItem("next") || null
  );
  const [prev, setPrev] = useState<string | null>(
    () => sessionStorage.getItem("prev") || null
  );

  useEffect(() => {
    const currentUrl =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Update prev on every route change
    setPrev((_) => {
      sessionStorage.setItem("prev", currentUrl);
      return currentUrl;
    });

    // If page requires auth and no user → redirect to login with ?next
    if (requireAuth && !user) {
      setNext(currentUrl);
      sessionStorage.setItem("next", currentUrl);
      router.push(`/login?next=${encodeURIComponent(currentUrl)}`);
    }
  }, [requireAuth, user, router, pathname, searchParams]);

  // keep sessionStorage synced
  useEffect(() => {
    if (next) sessionStorage.setItem("next", next);
  }, [next]);

  useEffect(() => {
    if (prev) sessionStorage.setItem("prev", prev);
  }, [prev]);

  return { user, next, prev, setNext, setPrev };
}
