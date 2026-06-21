import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../../server-lib/utils.js";

/**
 * PATCH  /api/admin/reviews/[id]  { status: "Approved" | "Rejected" }
 * DELETE /api/admin/reviews/[id]
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid review id" });
    return;
  }

  const db = getDb();

  if (req.method === "PATCH") {
    const status = req.body?.status;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    try {
      await db.update(schema.reviews).set({ status }).where(eq(schema.reviews.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[admin/reviews/:id] update failed:", err);
      res.status(500).json({ error: "Failed to update review" });
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      await db.delete(schema.reviews).where(eq(schema.reviews.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[admin/reviews/:id] delete failed:", err);
      res.status(500).json({ error: "Failed to delete review" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
