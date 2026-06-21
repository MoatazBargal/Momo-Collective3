import { z } from "zod";

/** Create/update product payload (admin) */
export const productInputSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().max(5000).optional(),
  category: z.enum(["tees", "denim", "hoodies"]),
  basePrice: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  sizeGuide: z.string().max(2000).optional(),
  isActive: z.boolean().default(true),
});

/** Partial schema for PATCH updates */
export const productUpdateSchema = productInputSchema.partial();

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
