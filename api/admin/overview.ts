import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, gte, desc, eq, and } from "drizzle-orm";
import { getDb, schema } from "../../server-lib/db.js";
import { applyCors, requireAdmin } from "../../server-lib/utils.js";

const LOW_STOCK_THRESHOLD = 5;

/**
 * GET /api/admin/overview
 * One call that powers the dashboard home: KPIs, 30-day revenue series,
 * recent orders, low-stock variants, and top products.
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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // --- KPIs ---
    const [totals] = await db
      .select({
        totalOrders: sql<number>`count(*)::int`,
        totalRevenue: sql<string>`coalesce(sum(case when ${schema.orders.status} <> 'Cancelled' then ${schema.orders.total} else 0 end), 0)`,
        avgOrderValue: sql<string>`coalesce(avg(case when ${schema.orders.status} <> 'Cancelled' then ${schema.orders.total} else null end), 0)`,
      })
      .from(schema.orders);

    const [today] = await db
      .select({
        count: sql<number>`count(*)::int`,
        revenue: sql<string>`coalesce(sum(${schema.orders.total}), 0)`,
      })
      .from(schema.orders)
      .where(gte(schema.orders.createdAt, startOfToday));

    const [pending] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.orders)
      .where(eq(schema.orders.status, "Pending"));

    const [productsSold] = await db
      .select({ qty: sql<number>`coalesce(sum(${schema.orderItems.quantity}), 0)::int` })
      .from(schema.orderItems);

    // --- 30-day revenue series (filled for every day) ---
    const revenueRows = await db
      .select({
        day: sql<string>`to_char(${schema.orders.createdAt}, 'YYYY-MM-DD')`,
        revenue: sql<string>`coalesce(sum(case when ${schema.orders.status} <> 'Cancelled' then ${schema.orders.total} else 0 end), 0)`,
        orders: sql<number>`count(*)::int`,
      })
      .from(schema.orders)
      .where(gte(schema.orders.createdAt, thirtyDaysAgo))
      .groupBy(sql`to_char(${schema.orders.createdAt}, 'YYYY-MM-DD')`);

    const revenueMap = new Map(revenueRows.map((r) => [r.day, r]));
    const revenueSeries: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const row = revenueMap.get(key);
      revenueSeries.push({
        date: key,
        revenue: row ? Number(row.revenue) : 0,
        orders: row ? row.orders : 0,
      });
    }

    // --- Recent orders (last 8) ---
    const recentOrders = await db
      .select({
        id: schema.orders.id,
        orderNumber: schema.orders.orderNumber,
        firstName: schema.orders.shippingFirstName,
        lastName: schema.orders.shippingLastName,
        total: schema.orders.total,
        status: schema.orders.status,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(8);

    // --- Top products (by qty sold) ---
    const topProducts = await db
      .select({
        productName: schema.orderItems.productName,
        qty: sql<number>`sum(${schema.orderItems.quantity})::int`,
        revenue: sql<string>`sum(${schema.orderItems.subtotal})`,
      })
      .from(schema.orderItems)
      .groupBy(schema.orderItems.productName)
      .orderBy(sql`sum(${schema.orderItems.quantity}) desc`)
      .limit(5);

    // --- Low stock variants ---
    const lowStock = await db
      .select({
        productName: schema.products.name,
        color: schema.productVariants.color,
        size: schema.productVariants.size,
        stock: schema.productVariants.stock,
        sku: schema.productVariants.sku,
      })
      .from(schema.productVariants)
      .innerJoin(schema.products, eq(schema.productVariants.productId, schema.products.id))
      .where(and(eq(schema.products.isActive, true), sql`${schema.productVariants.stock} <= ${LOW_STOCK_THRESHOLD}`))
      .orderBy(schema.productVariants.stock)
      .limit(10);

    const [activeCustomers] = await db
      .select({ count: sql<number>`count(distinct ${schema.orders.shippingPhone})::int` })
      .from(schema.orders);

    res.status(200).json({
      kpis: {
        totalRevenue: totals?.totalRevenue ?? "0",
        totalOrders: totals?.totalOrders ?? 0,
        ordersToday: today?.count ?? 0,
        revenueToday: today?.revenue ?? "0",
        avgOrderValue: totals?.avgOrderValue ?? "0",
        pendingOrders: pending?.count ?? 0,
        productsSold: productsSold?.qty ?? 0,
        activeCustomers: activeCustomers?.count ?? 0,
        lowStockCount: lowStock.length,
      },
      revenueSeries,
      recentOrders,
      topProducts,
      lowStock,
    });
  } catch (err) {
    console.error("[admin/overview] failed:", err);
    res.status(500).json({ error: "Failed to load overview" });
  }
}
