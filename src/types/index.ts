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

export type Product = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  status?: string;
};

export type Review = {
  id: string;
  reviewerName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

export type Shop = {
  id: string;
  name: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  createdAt: string;
  products?: Product[];
  reviews?: Review[];
};