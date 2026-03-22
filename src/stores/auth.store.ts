import type { AuthState } from "@/types";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,

  setAccessToken: (token) =>
    set(() => ({
      accessToken: token,
    })),

  clearAccessToken: () =>
    set(() => ({
      accessToken: null,
    })),
}));