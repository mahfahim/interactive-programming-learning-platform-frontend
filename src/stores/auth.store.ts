import { create } from "zustand";
import type { User } from "@/types";

export interface IUser {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  imageUrl?: string | null;
  avatar?: string;
}

interface AuthState {
  user: IUser | User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | User | null) => void;
  setAuth: (user: IUser | User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAuth: (user) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));