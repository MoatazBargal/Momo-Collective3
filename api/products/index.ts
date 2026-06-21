import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../server-lib/utils.js";
import { productInputSchema } from "../../shared/productTypes.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  const db = getDb();

  // GET — public list (storefront). Returns active products by default.
  if (req.method === "GET") {
    try {
      const includeInactive = req.query.all === "1";
      const rows = includeInactive
        ? await db.select().from(schema.products).orderBy(desc(schema.products.createdAt))
        : await db
            .select()
            .from(schema.products)
            .where(eq(schema.products.isActive, true))
            .orderBy(desc(schema.products.createdAt));
      res.status(200).json({ products: rows });
    } catch (err) {
      console.error("[products] list failed:", err);
      res.status(500).json({ error: "Failed to load products" });
    }
    return;
  }

  // POST — admin create
  if (req.method === "POST") {
    if (!requireAdmin(req, res)) return;

    const parsed = productInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid product", details: parsed.error.flatten() });
      return;
    }
    const p = parsed.data;

    try {
      const [created] = await db
        .insert(schema.products)
        .values({
          name: p.name,
          slug: p.slug,
          description: p.description,
          category: p.category,
          basePrice: p.basePrice.toFixed(2),
          compareAtPrice: p.compareAtPrice?.toFixed(2),
          images: p.images,
          sizeGuide: p.sizeGuide,
          isActive: p.isActive,
        })
        .returning();
      res.status(201).json({ product: created });
    } catch (err) {
      // Unique violation on slug
      if (err instanceof Error && err.message.includes("unique")) {
        res.status(409).json({ error: "A product with this slug already exists" });
        return;
      }
      console.error("[products] create failed:", err);
      res.status(500).json({ error: "Failed to create product" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
