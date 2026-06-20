import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, gte } from "drizzle-orm";
import { getDb, schema } from "../_lib/db";
import { applyCors, requireAdmin } from "../_lib/utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req, res)) return;
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const db = getDb();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Total orders + revenue (exclude cancelled from revenue)
    const [totals] = await db
      .select({
        totalOrders: sql<number>`count(*)::int`,
        totalRevenue: sql<string>`coalesce(sum(case when ${schema.orders.status} <> 'Cancelled' then ${schema.orders.total} else 0 end), 0)`,
      })
      .from(schema.orders);

    // Orders today
    const [today] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.orders)
      .where(gte(schema.orders.createdAt, startOfToday));

    // Best seller (by quantity)
    const bestSellers = await db
      .select({
        productName: schema.orderItems.productName,
        qty: sql<number>`sum(${schema.orderItems.quantity})::int`,
      })
      .from(schema.orderItems)
      .groupBy(schema.orderItems.productName)
      .orderBy(sql`sum(${schema.orderItems.quantity}) desc`)
      .limit(1);

    // Pending count (needs action)
    const [pending] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.orders)
      .where(sql`${schema.orders.status} = 'Pending'`);

    res.status(200).json({
      totalOrders: totals?.totalOrders ?? 0,
      totalRevenue: totals?.totalRevenue ?? "0",
      ordersToday: today?.count ?? 0,
      pendingOrders: pending?.count ?? 0,
      bestSeller: bestSellers[0]?.productName ?? "—",
    });
  } catch (err) {
    console.error("[admin/stats] failed:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
}
