"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// Assuming this alias resolves correctly when compilation errors are ignored
import { useAuthStore } from "@/store/auth/authStore";

export function useAuthRedirect(requireAuth: boolean = true) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state to null to avoid accessing 'sessionStorage' during SSR.
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);

  // Use a state variable to track if the client environment is ready and storage has been read
  const [isReady, setIsReady] = useState(false);

  // EFFECT 1: Client-Side Initialization
  // This runs once on mount (client-side) to safely read session storage values.
  useEffect(() => {
    try {
      setNext(sessionStorage.getItem("next") || null);
      setPrev(sessionStorage.getItem("prev") || null);
    } catch (e) {
      console.error("Could not access sessionStorage:", e);
    } finally {
      setIsReady(true);
    }
  }, []); // Run only on mount

  // EFFECT 2: Handle Redirection and update 'prev' history
  useEffect(() => {
    // Only proceed once storage values have been read and set (i.e., client is ready)
    if (!isReady) return;

    const currentUrl =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // 1. Update previous URL in state and storage
    // We update this *before* checking auth to log the current page if it's hit.
    setPrev((_) => {
      // Use try/catch to ensure storage access doesn't break the component
      try {
        sessionStorage.setItem("prev", currentUrl);
      } catch (e) {
        console.error("Failed to set 'prev' in sessionStorage:", e);
      }
      return currentUrl;
    });

    // 2. Auth Check and Redirect
    // If page requires auth and no user → redirect to login with ?next
    if (requireAuth && !user) {
      // Set 'next' state and storage item
      setNext(currentUrl);
      try {
        sessionStorage.setItem("next", currentUrl);
      } catch (e) {
        console.error("Failed to set 'next' in sessionStorage:", e);
      }

      // Perform the redirect
      router.push(`/login?next=${encodeURIComponent(currentUrl)}`);
    }
  }, [isReady, requireAuth, user, router, pathname, searchParams]);

  // EFFECT 3 & 4: (Cleaned up, no longer strictly needed as updates are in Effect 2)
  // Removed the separate sync useEffects as the logic is now consolidated
  // into the main useEffect for better performance and reduced re-renders.

  return { user, next, prev, setNext, setPrev, isReady };
}
