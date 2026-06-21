import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../../server-lib/utils.js";
import { couponUpdateSchema } from "../../../shared/couponTypes.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid coupon id" });
    return;
  }

  const db = getDb();

  if (req.method === "PATCH") {
    const parsed = couponUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid update", details: parsed.error.flatten() });
      return;
    }
    const u = parsed.data;
    try {
      await db
        .update(schema.coupons)
        .set({
          ...(u.code !== undefined && { code: u.code.toUpperCase() }),
          ...(u.discountType !== undefined && { discountType: u.discountType }),
          ...(u.value !== undefined && { value: u.value.toFixed(2) }),
          ...(u.minSubtotal !== undefined && { minSubtotal: u.minSubtotal.toFixed(2) }),
          ...(u.usageLimit !== undefined && { usageLimit: u.usageLimit }),
          ...(u.expiresAt !== undefined && { expiresAt: u.expiresAt ? new Date(u.expiresAt) : null }),
          ...(u.isActive !== undefined && { isActive: u.isActive }),
        })
        .where(eq(schema.coupons.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[admin/coupons/:id] update failed:", err);
      res.status(500).json({ error: "Failed to update coupon" });
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      await db.delete(schema.coupons).where(eq(schema.coupons.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[admin/coupons/:id] delete failed:", err);
      res.status(500).json({ error: "Failed to delete coupon" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
