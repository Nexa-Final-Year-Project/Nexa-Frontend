"use client";

import { useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { useAuthStore } from "@/store/auth/authStore";
import { useRouter, usePathname } from "next/navigation";

/**
 * AuthStateManager ensures auth state persistence across navigation
 * and handles token validation/refresh
 */
export function AuthStateManager() {
  const { user, setUser, logout, refreshToken, setTokenExpiry } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const auth = getAuth(app);

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get fresh token
          const idToken = await firebaseUser.getIdToken();
          const storedToken = localStorage.getItem("authToken");

          // If token changed or doesn't exist, update it
          if (idToken !== storedToken) {
            localStorage.setItem("authToken", idToken);
            
            // Decode and store expiry
            const tokenParts = idToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload.exp) {
                setTokenExpiry(payload.exp * 1000);
              }
            }
          }

          // If we have a Firebase user but no Zustand user, restore from localStorage
          if (!user) {
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
              try {
                const userData = JSON.parse(storedUserData);
                setUser(userData);
                console.log("Auth state restored from localStorage");
              } catch (error) {
                console.error("Failed to parse stored user data:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          // If token fetch fails, logout
          logout();
          const auth = getAuth(app);
          await auth.signOut();
        }
      } else {
        // Firebase user is null, ensure we're logged out
        if (user) {
          console.log("Firebase user signed out, clearing local state");
          logout();
        }
      }

      hasInitialized.current = true;
    });

    // Validate token on mount
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("userData");

      if (token && storedUser) {
        try {
          // Decode token to check expiry
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expiryTime = payload.exp * 1000;
            const now = Date.now();

            // If token is expired or expires soon (within 2 minutes), refresh
            if (expiryTime - now < 2 * 60 * 1000) {
              console.log("Token expired or expiring soon, refreshing...");
              const newToken = await refreshToken();
              
              if (!newToken) {
                // Refresh failed, logout
                console.error("Token refresh failed, logging out");
                logout();
                const auth = getAuth(app);
                await auth.signOut();
                
                // Redirect to login if not already on auth page
                if (!pathname?.startsWith("/login") && !pathname?.startsWith("/register")) {
                  router.push("/login");
                }
              }
            } else {
              // Token is valid, ensure user state is set
              if (!user) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setTokenExpiry(expiryTime);
              }
            }
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
          const auth = getAuth(app);
          await auth.signOut();
        }
      }
    };

    validateToken();

    return () => unsubscribe();
  }, [user, setUser, logout, refreshToken, setTokenExpiry, router, pathname]);

  return null;
}
