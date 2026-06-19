import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table - stores core product information
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: mysqlEnum("category", ["tees", "denim", "hoodies"]).notNull(),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  images: json("images").$type<string[]>().notNull(), // Array of image URLs
  sizeGuide: text("sizeGuide"), // HTML or markdown for size guide
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product variants - color and size combinations with stock
 */
export const productVariants = mysqlTable("productVariants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  color: varchar("color", { length: 100 }).notNull(), // e.g., "Black", "White", "Navy"
  size: mysqlEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]).notNull(),
  stock: int("stock").default(0).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

/**
 * Shopping cart - persists for both guests and logged-in users
 */
export const cart = mysqlTable("cart", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // NULL for guest carts
  sessionId: varchar("sessionId", { length: 255 }), // For guest carts
  variantId: int("variantId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cart = typeof cart.$inferSelect;
export type InsertCart = typeof cart.$inferInsert;

/**
 * Wishlist - saved products for later
 */
export const wishlist = mysqlTable("wishlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;

/**
 * Orders - COD orders with shipping info
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // NULL for guest checkout
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["Pending", "Shipped", "Delivered", "Cancelled"]).default("Pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["COD"]).default("COD").notNull(),
  
  // Shipping info
  shippingFirstName: varchar("shippingFirstName", { length: 100 }).notNull(),
  shippingLastName: varchar("shippingLastName", { length: 100 }).notNull(),
  shippingEmail: varchar("shippingEmail", { length: 320 }).notNull(),
  shippingPhone: varchar("shippingPhone", { length: 20 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
  shippingPostalCode: varchar("shippingPostalCode", { length: 20 }).notNull(),
  shippingCountry: varchar("shippingCountry", { length: 100 }).default("Egypt").notNull(),
  
  // Additional info
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items - line items in an order
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  variantId: int("variantId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  color: varchar("color", { length: 100 }).notNull(),
  size: varchar("size", { length: 10 }).notNull(),
  quantity: int("quantity").notNull(),
  pricePerUnit: decimal("pricePerUnit", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Saved addresses - for quick checkout
 */
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 100 }), // e.g., "Home", "Work"
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postalCode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).default("Egypt").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;
