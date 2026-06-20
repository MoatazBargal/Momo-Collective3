import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
  boolean,
  json,
  serial,
} from "drizzle-orm/pg-core";

/* ---------- Enums ---------- */
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const categoryEnum = pgEnum("category", ["tees", "denim", "hoodies"]);
export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]);
export const orderStatusEnum = pgEnum("order_status", [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
]);
export const paymentMethodEnum = pgEnum("payment_method", ["COD", "Online"]);
export const paymentStatusEnum = pgEnum("payment_status", ["Unpaid", "Paid", "Refunded"]);

/**
 * Core user table backing auth flow (admin users for now).
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table.
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  images: json("images").$type<string[]>().notNull(),
  sizeGuide: text("size_guide"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product variants - color and size combinations with stock.
 */
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  color: varchar("color", { length: 100 }).notNull(),
  size: sizeEnum("size").notNull(),
  stock: integer("stock").default(0).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

/**
 * Orders - COD + Online, with shipping info.
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  status: orderStatusEnum("status").default("Pending").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").default("COD").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("Unpaid").notNull(),

  shippingFirstName: varchar("shipping_first_name", { length: 100 }).notNull(),
  shippingLastName: varchar("shipping_last_name", { length: 100 }).notNull(),
  shippingEmail: varchar("shipping_email", { length: 320 }).notNull(),
  shippingPhone: varchar("shipping_phone", { length: 20 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
  shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
  shippingCountry: varchar("shipping_country", { length: 100 }).default("Egypt").notNull(),

  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items - line items in an order.
 */
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  variantId: integer("variant_id"),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productSlug: varchar("product_slug", { length: 255 }),
  color: varchar("color", { length: 100 }).notNull(),
  size: varchar("size", { length: 10 }).notNull(),
  quantity: integer("quantity").notNull(),
  pricePerUnit: numeric("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
