import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  BarChart3,
  Package,
  ShoppingBag,
  LogOut,
  RefreshCw,
  TrendingUp,
  Clock,
  Tag,
  Star,
} from "lucide-react";
import {
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminStats,
  type AdminOrder,
  type AdminStats,
} from "@/lib/api";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminOrderDetailModal from "@/components/admin/AdminOrderDetailModal";
const AdminOverview = lazy(() => import("@/components/admin/AdminOverview"));

const STATUSES = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const NEXT_STATUS: Record<string, string[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

const TOKEN_KEY = "momo_admin_token";

export default function AdminDashboard() {
  const [token, setToken] = useState<string>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) || "" : ""
  );
  const [tokenInput, setTokenInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState<"overview" | "orders" | "products" | "coupons" | "reviews">("overview");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const load = useCallback(
    async (tok: string, status: string) => {
      setLoading(true);
      try {
        const [s, o] = await Promise.all([
          fetchAdminStats(tok),
          fetchAdminOrders(tok, status),
        ]);
        setStats(s);
        setOrders(o.orders);
        setAuthed(true);
        sessionStorage.setItem(TOKEN_KEY, tok);
      } catch (err) {
        setAuthed(false);
        sessionStorage.removeItem(TOKEN_KEY);
        toast.error(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auto-load if token already saved
  useEffect(() => {
    if (token) load(token, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload orders when filter changes (if authed)
  useEffect(() => {
    if (authed && token) {
      fetchAdminOrders(token, filter).then((o) => setOrders(o.orders)).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setToken(tokenInput.trim());
    load(tokenInput.trim(), filter);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setOrders([]);
    setStats(null);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(token, id, status);
      toast.success(`Order marked ${status}`);
      load(token, filter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  // ---- Login gate ----
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 glow-field" style={{ backgroundColor: "var(--momo-bg)" }}>
        <div className="w-full max-w-sm glass-strong p-8" style={{ borderRadius: "16px" }}>
          <div className="text-center mb-8">
            <Link href="/">
              <span className="font-black text-3xl text-white cursor-pointer" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
                MOMO<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-dim text-sm mt-2 uppercase tracking-widest">Admin Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Admin token"
              className="w-full bg-transparent border border-momo text-white px-4 py-3 placeholder:text-dim focus:outline-none focus:border-accent"
              style={{ borderRadius: 0 }}
            />
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- Dashboard ----
  return (
    <div className="min-h-screen glow-field overflow-hidden" style={{ backgroundColor: "var(--momo-bg)" }}>
      <div className="container section-padding-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="eyebrow block mb-1">Dashboard</span>
            <h1 className="heading-section">{tab === "overview" ? "Overview" : tab === "orders" ? "Orders" : tab === "products" ? "Products" : tab === "coupons" ? "Coupons" : "Reviews"}</h1>
          </div>
          <div className="flex gap-2">
            {tab === "orders" && (
              <button onClick={() => load(token, filter)} className="glass-chip p-2.5 text-white" style={{ borderRadius: "10px" }} aria-label="Refresh">
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            )}
            <button onClick={handleLogout} className="glass-chip p-2.5 text-white" style={{ borderRadius: "10px" }} aria-label="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("overview")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors ${
              tab === "overview" ? "bg-accent text-white" : "glass-chip text-white"
            }`}
            style={{ fontFamily: "var(--font-display)", borderRadius: "10px" }}
          >
            <BarChart3 className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors ${
              tab === "orders" ? "bg-accent text-white" : "glass-chip text-white"
            }`}
            style={{ fontFamily: "var(--font-display)", borderRadius: "10px" }}
          >
            <ShoppingBag className="w-4 h-4" /> Orders
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors ${
              tab === "products" ? "bg-accent text-white" : "glass-chip text-white"
            }`}
            style={{ fontFamily: "var(--font-display)", borderRadius: "10px" }}
          >
            <Package className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setTab("coupons")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors ${
              tab === "coupons" ? "bg-accent text-white" : "glass-chip text-white"
            }`}
            style={{ fontFamily: "var(--font-display)", borderRadius: "10px" }}
          >
            <Tag className="w-4 h-4" /> Coupons
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors ${
              tab === "reviews" ? "bg-accent text-white" : "glass-chip text-white"
            }`}
            style={{ fontFamily: "var(--font-display)", borderRadius: "10px" }}
          >
            <Star className="w-4 h-4" /> Reviews
          </button>
        </div>

        {tab === "overview" && (
          <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            <AdminOverview token={token} onOpenOrder={setSelectedOrderId} />
          </Suspense>
        )}

        {tab === "products" && <AdminProducts token={token} />}

        {tab === "coupons" && <AdminCoupons token={token} />}

        {tab === "reviews" && <AdminReviews token={token} />}

        {tab === "orders" && (
        <>
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Revenue" value={`${Number(stats.totalRevenue).toLocaleString()} LE`} />
            <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={String(stats.totalOrders)} />
            <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={String(stats.pendingOrders)} accent />
            <StatCard icon={<Package className="w-5 h-5" />} label="Best Seller" value={stats.bestSeller} small />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                filter === s ? "bg-accent text-white" : "glass-chip text-white"
              }`}
              style={{ fontFamily: "var(--font-display)", borderRadius: "8px" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="glass p-12 text-center" style={{ borderRadius: "16px" }}>
            <BarChart3 className="w-10 h-10 mx-auto text-dim mb-3" />
            <p className="text-dim">No orders {filter !== "All" ? `with status "${filter}"` : "yet"}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="glass p-5" style={{ borderRadius: "14px" }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="font-bold text-white hover:text-accent transition-colors"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {order.orderNumber}
                      </button>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-dim text-sm">
                      {order.shippingFirstName} {order.shippingLastName} · {order.shippingPhone} · {order.shippingCity}
                    </p>
                    <p className="text-dim text-xs mt-1">
                      {new Date(order.createdAt).toLocaleString("en-EG")} · {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-accent">{Number(order.total).toLocaleString()} LE</span>
                    {NEXT_STATUS[order.status]?.length > 0 && (
                      <div className="flex gap-2">
                        {NEXT_STATUS[order.status].map((next) => (
                          <button
                            key={next}
                            onClick={() => handleStatusChange(order.id, next)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                              next === "Cancelled" ? "border border-momo text-dim hover:text-white" : "bg-accent text-white"
                            }`}
                            style={{ fontFamily: "var(--font-display)", borderRadius: "8px" }}
                          >
                            {next}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </div>

      {selectedOrderId !== null && (
        <AdminOrderDetailModal
          token={token}
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent, small }: { icon: React.ReactNode; label: string; value: string; accent?: boolean; small?: boolean }) {
  return (
    <div className={`p-5 ${accent ? "glass-accent" : "glass"}`} style={{ borderRadius: "14px" }}>
      <div className="flex items-center gap-2 text-dim mb-2">
        {icon}
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
      <p className={`font-bold ${small ? "text-base" : "text-2xl"}`} style={{ fontFamily: "var(--font-display)" }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "text-accent",
    Confirmed: "text-blue-400",
    Shipped: "text-purple-400",
    Delivered: "text-green-400",
    Cancelled: "text-dim",
  };
  return (
    <span className={`text-xs font-bold uppercase tracking-widest ${colors[status] || "text-white"}`}>
      ● {status}
    </span>
  );
}
