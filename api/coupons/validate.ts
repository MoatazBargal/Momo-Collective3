import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, sql } from "drizzle-orm";
import { getDb, schema } from "../../server-lib/db.js";
import { applyCors } from "../../server-lib/utils.js";
import { computeDiscount } from "../../shared/couponTypes.js";

/**
 * POST /api/coupons/validate
 * Body: { code: string, subtotal: number }
 * Public — used at checkout to validate a coupon and return the discount.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const code = String(req.body?.code || "").trim().toUpperCase();
  const subtotal = Number(req.body?.subtotal);

  if (!code || !Number.isFinite(subtotal) || subtotal < 0) {
    res.status(400).json({ error: "code and subtotal are required" });
    return;
  }

  try {
    const db = getDb();
    const [coupon] = await db.select().from(schema.coupons).where(eq(schema.coupons.code, code));

    if (!coupon || !coupon.isActive) {
      res.status(404).json({ error: "Invalid coupon code" });
      return;
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      res.status(410).json({ error: "This coupon has expired" });
      return;
    }
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      res.status(410).json({ error: "This coupon has reached its usage limit" });
      return;
    }
    if (coupon.minSubtotal !== null && subtotal < Number(coupon.minSubtotal)) {
      res.status(422).json({
        error: `Minimum order of ${Number(coupon.minSubtotal).toLocaleString()} LE required for this coupon`,
      });
      return;
    }

    const discountAmount = computeDiscount(coupon.discountType, Number(coupon.value), subtotal);

    res.status(200).json({
      code: coupon.code,
      discountType: coupon.discountType,
      value: Number(coupon.value),
      discountAmount,
    });
  } catch (err) {
    console.error("[coupons/validate] failed:", err);
    res.status(500).json({ error: "Failed to validate coupon" });
  }
}
