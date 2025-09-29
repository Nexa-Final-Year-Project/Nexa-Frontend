// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist `user`
    }
  )
);
