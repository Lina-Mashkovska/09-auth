// lib/store/authStore.ts
import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  clearIsAuthenticated: () => void;
  clearAuth: () => void;              // ← додали
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false }), // ← аліас
}));

