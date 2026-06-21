import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../../server-lib/utils.js";

const VALID_STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const db = getDb();

  // GET single order with items
  if (req.method === "GET") {
    try {
      const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      const items = await db
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, id));
      res.status(200).json({ order, items });
    } catch (err) {
      console.error("[admin/orders/:id] get failed:", err);
      res.status(500).json({ error: "Failed to load order" });
    }
    return;
  }

  // PATCH status
  if (req.method === "PATCH") {
    const status = req.body?.status;
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    try {
      await db
        .update(schema.orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(schema.orders.id, id));
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[admin/orders/:id] update failed:", err);
      res.status(500).json({ error: "Failed to update order" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
