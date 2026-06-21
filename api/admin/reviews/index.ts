import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "../../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../../server-lib/utils.js";

/**
 * GET /api/admin/reviews?status=Pending  → list reviews (optionally by status)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req, res)) return;
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const db = getDb();
    const status = req.query.status as string | undefined;

    const base = db
      .select({
        id: schema.reviews.id,
        productId: schema.reviews.productId,
        productName: schema.products.name,
        authorName: schema.reviews.authorName,
        rating: schema.reviews.rating,
        title: schema.reviews.title,
        body: schema.reviews.body,
        status: schema.reviews.status,
        createdAt: schema.reviews.createdAt,
      })
      .from(schema.reviews)
      .leftJoin(schema.products, eq(schema.reviews.productId, schema.products.id))
      .orderBy(desc(schema.reviews.createdAt));

    const rows =
      status && status !== "All"
        ? await base.where(eq(schema.reviews.status, status as "Pending" | "Approved" | "Rejected"))
        : await base;

    res.status(200).json({ reviews: rows });
  } catch (err) {
    console.error("[admin/reviews] list failed:", err);
    res.status(500).json({ error: "Failed to load reviews" });
  }
}
