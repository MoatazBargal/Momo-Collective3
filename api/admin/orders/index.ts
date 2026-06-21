import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "../../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../../server-lib/utils.js";

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

    const rows = status
      ? await db
          .select()
          .from(schema.orders)
          .where(eq(schema.orders.status, status as never))
          .orderBy(desc(schema.orders.createdAt))
      : await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));

    res.status(200).json({ orders: rows });
  } catch (err) {
    console.error("[admin/orders] list failed:", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
}
