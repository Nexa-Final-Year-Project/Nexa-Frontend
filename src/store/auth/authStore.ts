import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";

interface AuthState {
  user: User | null;
  tokenExpiryTime: number | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setTokenExpiry: (expiryTime: number) => void;
  refreshToken: () => Promise<string | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokenExpiryTime: null,

      setUser: (user: User) => set({ user }),

      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setTokenExpiry: (expiryTime: number) =>
        set({ tokenExpiryTime: expiryTime }),

      refreshToken: async () => {
        try {
          const auth = getAuth(app);
          const currentUser = auth.currentUser;

          if (!currentUser) {
            console.warn("No Firebase user to refresh token");
            return null;
          }

          // Force refresh the token
          const newToken = await currentUser.getIdToken(true);

          // Update localStorage
          localStorage.setItem("authToken", newToken);

          // Decode to get expiry time
          const tokenParts = newToken.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expiryTime = payload.exp * 1000; // Convert to milliseconds
            set({ tokenExpiryTime: expiryTime });
          }

          console.log("Token refreshed successfully");
          return newToken;
        } catch (error) {
          console.error("Token refresh failed:", error);

          // Show user-friendly error if available
          if (typeof window !== "undefined") {
            const { toast } = await import("sonner");
            toast.error("Session refresh failed. Please log in again.");
          }

          // Clear auth state on refresh failure
          set({ user: null, tokenExpiryTime: null });
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");

          return null;
        }
      },

      logout: () => {
        set({ user: null, tokenExpiryTime: null });
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokenExpiryTime: state.tokenExpiryTime,
      }),
    }
  )
);

// Auto-refresh token before expiry (5 minutes before expiration)
if (typeof window !== "undefined") {
  setInterval(() => {
    const state = useAuthStore.getState();
    const { tokenExpiryTime, refreshToken, user } = state;

    if (user && tokenExpiryTime) {
      const now = Date.now();
      const timeUntilExpiry = tokenExpiryTime - now;

      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        console.log("Auto-refreshing token before expiry...");
        refreshToken();
      }
    }
  }, 60 * 1000); // Check every minute
}
