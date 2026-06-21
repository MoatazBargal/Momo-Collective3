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

/** Full order detail (with line items) */
export type AdminOrderItem = {
  id: number;
  productName: string;
  productSlug: string | null;
  color: string;
  size: string;
  quantity: number;
  pricePerUnit: string;
  subtotal: string;
};

export type AdminOrderDetail = AdminOrder & {
  shippingEmail: string;
  shippingAddress: string;
  shippingPostalCode: string | null;
  shippingCountry: string;
  subtotal: string;
  shippingCost: string;
  paymentStatus: string;
  notes: string | null;
};

export function fetchAdminOrder(token: string, id: number) {
  return apiFetch<{ order: AdminOrderDetail; items: AdminOrderItem[] }>(
    `/admin/orders/${id}`,
    { headers: adminHeaders(token) }
  );
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

/* ---------- Products (admin CRUD + public read) ---------- */
export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  basePrice: string;
  compareAtPrice: string | null;
  images: string[];
  sizeGuide: string | null;
  isActive: boolean;
  createdAt: string;
};

export type ProductPayload = {
  name: string;
  slug: string;
  description?: string;
  category: "tees" | "denim" | "hoodies";
  basePrice: number;
  compareAtPrice?: number;
  images: string[];
  sizeGuide?: string;
  isActive?: boolean;
};

/** Public list (active products). Pass all=true (admin) to include inactive. */
export function fetchProducts(all = false) {
  return apiFetch<{ products: ApiProduct[] }>(`/products${all ? "?all=1" : ""}`);
}

export function createProduct(token: string, payload: ProductPayload) {
  return apiFetch<{ product: ApiProduct }>("/products", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function updateProduct(token: string, id: number, payload: Partial<ProductPayload>) {
  return apiFetch<{ ok: boolean }>(`/products/${id}`, {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(token: string, id: number) {
  return apiFetch<{ ok: boolean }>(`/products/${id}`, {
    method: "DELETE",
    headers: adminHeaders(token),
  });
}

/* ---------- Payment (Paymob) ---------- */
export type IntentionResponse = {
  clientSecret: string;
  publicKey: string;
};

export function createPaymentIntention(orderId: number) {
  return apiFetch<IntentionResponse>("/payment/intention", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

/* ---------- Dashboard Overview ---------- */
export type OverviewKpis = {
  totalRevenue: string;
  totalOrders: number;
  ordersToday: number;
  revenueToday: string;
  avgOrderValue: string;
  pendingOrders: number;
  productsSold: number;
  activeCustomers: number;
  lowStockCount: number;
};

export type RevenuePoint = { date: string; revenue: number; orders: number };
export type TopProduct = { productName: string; qty: number; revenue: string };
export type LowStockItem = {
  productName: string;
  color: string;
  size: string;
  stock: number;
  sku: string;
};
export type RecentOrder = {
  id: number;
  orderNumber: string;
  firstName: string;
  lastName: string;
  total: string;
  status: string;
  createdAt: string;
};

export type AdminOverview = {
  kpis: OverviewKpis;
  revenueSeries: RevenuePoint[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  lowStock: LowStockItem[];
};

export function fetchAdminOverview(token: string) {
  return apiFetch<AdminOverview>("/admin/overview", { headers: adminHeaders(token) });
}

/* ---------- Coupons ---------- */
export type AppliedCoupon = {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  discountAmount: number;
};

export function validateCoupon(code: string, subtotal: number) {
  return apiFetch<AppliedCoupon>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

export type AdminCoupon = {
  id: number;
  code: string;
  discountType: "percentage" | "fixed";
  value: string;
  minSubtotal: string | null;
  usageLimit: number | null;
  usageCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

export type CouponPayload = {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  minSubtotal?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
};

export function fetchCoupons(token: string) {
  return apiFetch<{ coupons: AdminCoupon[] }>("/admin/coupons", { headers: adminHeaders(token) });
}
export function createCoupon(token: string, payload: CouponPayload) {
  return apiFetch<{ coupon: AdminCoupon }>("/admin/coupons", {
    method: "POST", headers: adminHeaders(token), body: JSON.stringify(payload),
  });
}
export function updateCoupon(token: string, id: number, payload: Partial<CouponPayload>) {
  return apiFetch<{ ok: boolean }>(`/admin/coupons/${id}`, {
    method: "PATCH", headers: adminHeaders(token), body: JSON.stringify(payload),
  });
}
export function deleteCoupon(token: string, id: number) {
  return apiFetch<{ ok: boolean }>(`/admin/coupons/${id}`, {
    method: "DELETE", headers: adminHeaders(token),
  });
}
