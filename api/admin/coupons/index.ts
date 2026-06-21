import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc } from "drizzle-orm";
import { getDb, schema } from "../../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../../server-lib/utils.js";
import { couponInputSchema } from "../../../shared/couponTypes.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const db = getDb();

  if (req.method === "GET") {
    try {
      const rows = await db.select().from(schema.coupons).orderBy(desc(schema.coupons.createdAt));
      res.status(200).json({ coupons: rows });
    } catch (err) {
      console.error("[admin/coupons] list failed:", err);
      res.status(500).json({ error: "Failed to load coupons" });
    }
    return;
  }

  if (req.method === "POST") {
    const parsed = couponInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid coupon", details: parsed.error.flatten() });
      return;
    }
    const c = parsed.data;
    try {
      const [created] = await db
        .insert(schema.coupons)
        .values({
          code: c.code.toUpperCase(),
          discountType: c.discountType,
          value: c.value.toFixed(2),
          minSubtotal: c.minSubtotal?.toFixed(2),
          usageLimit: c.usageLimit,
          expiresAt: c.expiresAt ? new Date(c.expiresAt) : null,
          isActive: c.isActive,
        })
        .returning();
      res.status(201).json({ coupon: created });
    } catch (err) {
      if (err instanceof Error && err.message.includes("unique")) {
        res.status(409).json({ error: "A coupon with this code already exists" });
        return;
      }
      console.error("[admin/coupons] create failed:", err);
      res.status(500).json({ error: "Failed to create coupon" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
