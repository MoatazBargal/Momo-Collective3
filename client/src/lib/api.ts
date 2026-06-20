import type { CreateOrderInput } from "@shared/orderTypes";

/**
 * Thin fetch wrapper for the Momo API (Vercel serverless functions under /api).
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export type CreateOrderResponse = {
  ok: boolean;
  orderNumber: string;
  orderId: number;
  total: string;
};

export function createOrder(input: CreateOrderInput) {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/* ---------- Admin (token-gated) ---------- */
export type AdminOrder = {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  paymentMethod: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingPhone: string;
  shippingCity: string;
  createdAt: string;
};

function adminHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function fetchAdminOrders(token: string, status?: string) {
  const q = status && status !== "All" ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<{ orders: AdminOrder[] }>(`/admin/orders${q}`, {
    headers: adminHeaders(token),
  });
}

export function updateOrderStatus(token: string, id: number, status: string) {
  return apiFetch<{ ok: boolean }>(`/admin/orders/${id}`, {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export type AdminStats = {
  totalOrders: number;
  totalRevenue: string;
  ordersToday: number;
  pendingOrders: number;
  bestSeller: string;
};

export function fetchAdminStats(token: string) {
  return apiFetch<AdminStats>("/admin/stats", { headers: adminHeaders(token) });
}
