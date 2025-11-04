import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  // Renamed to logout for clarity
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Removed 'get' as it was causing the crash
      user: null,
      setUser: (user: User) => set({ user }),
      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // ✅ Now only clears the in-memory state.
      // We rely on the public API (useAuthStore.persist.clearStorage())
      // to clear the disk storage from the component.
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({ user: state.user }),
    }
  )
);
