import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
  phone: z.string().max(30).optional(),
});

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(200),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const staffCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
  role: z.enum(["support", "manager", "super_admin"]),
});

export const staffUpdateSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["support", "manager", "super_admin"]).optional(),
  isActive: z.boolean().optional(),
});

export type StaffCreateInput = z.infer<typeof staffCreateSchema>;
export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>;
