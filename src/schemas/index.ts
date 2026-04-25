import { z } from "zod";

export const userSchema = z.object({
  fullName: z
    .string()
    .min(6, "Full name must be at least 6 characters.")
    .max(50, "Full name cannot be more than 50 characters."),
  email: z.email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot be more than 16 characters"),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(4)
    .max(4)
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot be more than 16 characters"),
});

export const shopCreateSchema = z.object({
  name: z
    .string()
    .min(3, "Shop name must be at least 3 characters")
    .max(150, "Shop name cannot be more than 150 characters"),
  description: z
    .string()
    .min(10, "Shop description must be at least 10 characters")
    .max(300, "Shop description cannot be more than 300 characters"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location cannot be more than 100 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,15}$/, "Phone number must be valid (7-15 characters)"),
});

export const shopSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.date(),
});

export const productCreateSchema = z.object({
  shop_id: z
    .string()
    .min(1, "Shop ID is required"),
  product_name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(150, "Product name cannot be more than 150 characters"),
  product_description: z
    .string()
    .max(500, "Product description cannot be more than 500 characters")
    .optional(),
  product_price: z
    .number()
    .positive("Product price must be a positive number"),
  product_sold: z.boolean().default(false).optional(),
  product_review_id: z.number().nullable().optional(),
});

export const productUpdateSchema = z.object({
  product_name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(150, "Product name cannot be more than 150 characters"),
  product_description: z
    .string()
    .max(500, "Product description cannot be more than 500 characters")
    .optional(),
  product_price: z
    .number()
    .positive("Product price must be a positive number"),
  product_sold: z.boolean().default(false).optional(),
  product_review_id: z.number().nullable().optional(),
});

export const productSchema = z.object({
  id: z.string(),
  shop_id: z.string(),
  product_name: z.string(),
  product_description: z.string().optional(),
  product_price: z.number(),
  product_sold: z.boolean(),
  product_date: z.date(),
  product_review_id: z.number().nullable().optional(),
});
