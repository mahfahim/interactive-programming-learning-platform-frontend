import Cookies from "js-cookie";
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
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | User | null) => void;
  setAuth: (user: IUser | User, token?: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAuth: (user, token) => {
    if (token) {
      Cookies.set("accessToken", token, { expires: 7, path: "/" });
    }
    set({
      user,
      accessToken: token || null,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    Cookies.remove("accessToken", { path: "/" });
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
