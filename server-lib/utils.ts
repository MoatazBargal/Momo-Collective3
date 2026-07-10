import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth.js";
import { getDb, schema } from "./db.js";
import { eq } from "drizzle-orm";

/** Generate a human-friendly order number: MOMO-20260621-AB12CD */
export function generateOrderNumber(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MOMO-${date}-${rand}`;
}

/** Apply permissive CORS for same-origin SPA + handle preflight */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true; // handled
  }
  return false;
}

/**
 * Admin gate. Accepts EITHER:
 *  - Authorization: Bearer <ADMIN_TOKEN> (the site owner's master key — unchanged), OR
 *  - a valid staff session cookie (role support/manager/super_admin, and isActive).
 * This lets staff accounts use every existing admin endpoint with no per-endpoint changes.
 */
export async function requireAdmin(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const masterToken = process.env.ADMIN_TOKEN;
  const header = req.headers.authorization || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  if (masterToken && provided === masterToken) return true;

  const session = await getSession(req);
  if (session && session.role !== "user") {
    const db = getDb();
    const [staff] = await db
      .select({ isActive: schema.users.isActive })
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (staff?.isActive) return true;
  }

  res.status(401).json({ error: "Unauthorized" });
  return false;
}

/**
 * Manager-level gate: master token, or a manager/super_admin staff session.
 * Use for sensitive write actions (product delete, coupon management).
 */
export async function requireManager(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const masterToken = process.env.ADMIN_TOKEN;
  const header = req.headers.authorization || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  if (masterToken && provided === masterToken) return true;

  const session = await getSession(req);
  if (session && (session.role === "manager" || session.role === "super_admin")) {
    const db = getDb();
    const [staff] = await db
      .select({ isActive: schema.users.isActive })
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (staff?.isActive) return true;
  }

  res.status(403).json({ error: "Manager access required" });
  return false;
}

/**
 * Super-admin gate: master token, or a super_admin staff session.
 * Use for staff account management.
 */
export async function requireSuperAdmin(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const masterToken = process.env.ADMIN_TOKEN;
  const header = req.headers.authorization || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  if (masterToken && provided === masterToken) return true;

  const session = await getSession(req);
  if (session && session.role === "super_admin") {
    const db = getDb();
    const [staff] = await db
      .select({ isActive: schema.users.isActive })
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (staff?.isActive) return true;
  }

  res.status(403).json({ error: "Super admin access required" });
  return false;
}
