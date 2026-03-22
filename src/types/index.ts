import { userSchema } from "@/schemas";
import type { InternalAxiosRequestConfig } from "axios";
import z from "zod";

export type ChildProp = {
  children: React.ReactNode;
};

export type UserState = {
  user: z.infer<typeof userSchema> | null;

  hasHydrated: boolean;
  setUser: (user: z.infer<typeof userSchema>) => void;
  logout: () => void;
};

export interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export type AuthState = {
  accessToken : string | null,
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
}