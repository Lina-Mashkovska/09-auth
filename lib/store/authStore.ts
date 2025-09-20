// lib/store/authStore.ts
import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  // actions
  setUser: (u: User | null) => void;
  clearIsAuthenticated: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (u) => set({ user: u, isAuthenticated: !!u }),

  // очищаємо лише прапорець і користувача
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),

  // повне очищення (аналогічно вище, залишено для сумісності з існуючим кодом)
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));



