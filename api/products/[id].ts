import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../_lib/db";
import { applyCors, requireAdmin } from "../_lib/utils";
import { productUpdateSchema } from "../../shared/productTypes";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const db = getDb();

  // GET — public single product
  if (req.method === "GET") {
    try {
      const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id));
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      const variants = await db
        .select()
        .from(schema.productVariants)
        .where(eq(schema.productVariants.productId, id));
      res.status(200).json({ product, variants });
    } catch (err) {
      console.error("[products/:id] get failed:", err);
      res.status(500).json({ error: "Failed to load product" });
    }
    return;
  }

  // PATCH — admin update
  if (req.method === "PATCH") {
    if (!requireAdmin(req, res)) return;

    const parsed = productUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid update", details: parsed.error.flatten() });
      return;
    }
    const u = parsed.data;

    try {
      await db
        .update(schema.products)
        .set({
          ...(u.name !== undefined && { name: u.name }),
          ...(u.slug !== undefined && { slug: u.slug }),
          ...(u.description !== undefined && { description: u.description }),
          ...(u.category !== undefined && { category: u.category }),
          ...(u.basePrice !== undefined && { basePrice: u.basePrice.toFixed(2) }),
          ...(u.compareAtPrice !== undefined && { compareAtPrice: u.compareAtPrice.toFixed(2) }),
          ...(u.images !== undefined && { images: u.images }),
          ...(u.sizeGuide !== undefined && { sizeGuide: u.sizeGuide }),
          ...(u.isActive !== undefined && { isActive: u.isActive }),
          updatedAt: new Date(),
        })
        .where(eq(schema.products.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[products/:id] update failed:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
    return;
  }

  // DELETE — admin (soft delete: set inactive)
  if (req.method === "DELETE") {
    if (!requireAdmin(req, res)) return;
    try {
      await db
        .update(schema.products)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(schema.products.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[products/:id] delete failed:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
