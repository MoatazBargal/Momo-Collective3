import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, BarChart3, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: "pending" | "processing" | "shipped";
  date: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Oversized T-Shirt", price: 650, stock: 45, category: "Tops" },
  { id: 2, name: "Wide-Leg Denim", price: 1100, stock: 28, category: "Bottoms" },
  { id: 3, name: "Heavyweight Hoodie", price: 1200, stock: 15, category: "Tops" },
];

const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", customer: "Ahmed Hassan", total: 2900, status: "shipped", date: "2026-06-10" },
  { id: "ORD-002", customer: "Fatima Ali", total: 1650, status: "processing", date: "2026-06-12" },
  { id: "ORD-003", customer: "Mohamed Saleh", total: 3200, status: "pending", date: "2026-06-15" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [showProductForm, setShowProductForm] = useState(false);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const updateOrderStatus = (id: string, status: "pending" | "processing" | "shipped") => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    toast.success("Order status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shipped":
        return "text-green-600 bg-green-50";
      case "processing":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-accent surface";
      default:
        return "text-dim surface";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--momo-bg)" }}>
      <div className="section-padding container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-section">Admin Dashboard</h1>
          <Button className="btn-primary">Logout</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {["overview", "products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                tab === t
                  ? "bg-accent text-white"
                  : "surface text-dim hover:text-white"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="surface p-6 border border-momo">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dim text-sm mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold">{totalRevenue} LE</p>
                </div>
                <BarChart3 className="w-10 h-10 text-accent" />
              </div>
            </div>

            <div className="surface p-6 border border-momo">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dim text-sm mb-2">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <ShoppingCart className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="surface p-6 border border-momo">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dim text-sm mb-2">Total Products</p>
                  <p className="text-3xl font-bold">{totalProducts}</p>
                </div>
                <Package className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="surface p-6 border border-momo">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dim text-sm mb-2">Total Stock</p>
                  <p className="text-3xl font-bold">{totalStock}</p>
                </div>
                <Package className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-subsection">Products</h2>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="surface border border-momo overflow-hidden">
              <table className="w-full">
                <thead className="surface-2 border-b border-momo">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-momo hover:bg-white/5">
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">{product.price} LE</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock > 20
                              ? "bg-green-50 text-green-600"
                              : product.stock > 10
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="p-2 hover:bg-white/10 transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 hover:bg-white/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            <h2 className="heading-subsection mb-6">Recent Orders</h2>

            <div className="surface border border-momo overflow-hidden">
              <table className="w-full">
                <thead className="surface-2 border-b border-momo">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-momo hover:bg-white/5">
                      <td className="px-6 py-4 font-semibold">{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4 font-semibold text-accent">{order.total} LE</td>
                      <td className="px-6 py-4 text-sm text-dim">{order.date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as "pending" | "processing" | "shipped"
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
