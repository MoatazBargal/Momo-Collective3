import type { VercelRequest, VercelResponse } from "@vercel/node";

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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true; // handled
  }
  return false;
}

/**
 * Simple admin gate. Checks an Authorization: Bearer <ADMIN_TOKEN> header
 * against the ADMIN_TOKEN env var. For launch this is a shared secret;
 * upgrade to a real session/JWT provider later.
 */
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    res.status(500).json({ error: "Server auth not configured" });
    return false;
  }
  const header = req.headers.authorization || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  if (provided !== token) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
