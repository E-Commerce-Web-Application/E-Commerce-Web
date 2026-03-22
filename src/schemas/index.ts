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

export const taskCreateSchema = z.object({
  name: z
    .string()
    .min(3, "Task name must be at least 3 characters")
    .max(50, "Task name cannot be more than 50 characters"),
  description: z
    .string()
    .min(5, "Task description must be at least 5 characters.")
    .max(300, "Task description cannot be more than 300 characters"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
});

export const taskSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Task name must be at least 3 characters")
    .max(50, "Task name cannot be more than 50 characters"),
  description: z
    .string()
    .min(5, "Task description must be at least 5 characters.")
    .max(300, "Task description cannot be more than 300 characters"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
  createdAt: z.date(),
});

export const taskUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Task name must be at least 3 characters")
    .max(50, "Task name cannot be more than 50 characters")
    .optional(),
   description: z
    .string()
    .min(5, "Task description must be at least 5 characters.")
    .max(300, "Task description cannot be more than 300 characters").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});
