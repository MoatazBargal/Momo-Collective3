import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, schema } from "../../server-lib/db.js";
import { sendOrderEmail } from "../../server-lib/email.js";
import { generateOrderNumber, applyCors } from "../../server-lib/utils.js";
import { createOrderSchema, computeTotals } from "../../shared/orderTypes.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Validate payload
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order data", details: parsed.error.flatten() });
    return;
  }
  const input = parsed.data;

  // Server-side total computation (never trust client totals)
  const { subtotal, shippingCost, total } = computeTotals(input.items);
  const orderNumber = generateOrderNumber();

  try {
    const db = getDb();

    // Insert order
    const [order] = await db
      .insert(schema.orders)
      .values({
        orderNumber,
        status: "Pending",
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: input.paymentMethod,
        paymentStatus: "Unpaid",
        shippingFirstName: input.shipping.firstName,
        shippingLastName: input.shipping.lastName,
        shippingEmail: input.shipping.email,
        shippingPhone: input.shipping.phone,
        shippingAddress: input.shipping.address,
        shippingCity: input.shipping.city,
        shippingPostalCode: input.shipping.postalCode,
        shippingCountry: input.shipping.country,
        notes: input.notes,
      })
      .returning();

    // Insert order items
    const itemRows = input.items.map((it) => ({
      orderId: order.id,
      productName: it.productName,
      productSlug: it.productSlug,
      color: it.color,
      size: it.size,
      quantity: it.quantity,
      pricePerUnit: it.pricePerUnit.toFixed(2),
      subtotal: (it.pricePerUnit * it.quantity).toFixed(2),
    }));
    const insertedItems = await db.insert(schema.orderItems).values(itemRows).returning();

    // Fire email (must not fail the order)
    try {
      await sendOrderEmail(order, insertedItems);
    } catch (emailErr) {
      console.error("[orders] email failed (order still saved):", emailErr);
    }

    res.status(201).json({
      ok: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    });
  } catch (err) {
    console.error("[orders] create failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
}
