import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Package, LogOut, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered";
  items: number;
}

interface Address {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", date: "2026-06-10", total: 2900, status: "delivered", items: 3 },
  { id: "ORD-002", date: "2026-05-28", total: 1650, status: "shipped", items: 2 },
];

const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    name: "Home",
    address: "123 Main Street",
    city: "Cairo",
    phone: "+20 (123) 456-7890",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    address: "456 Business Ave",
    city: "Giza",
    phone: "+20 (123) 456-7890",
    isDefault: false,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "text-green-600 bg-green-50";
    case "shipped":
      return "text-blue-600 bg-blue-50";
    case "pending":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function Profile() {
  const [tab, setTab] = useState<"orders" | "addresses">("orders");

  const handleLogout = () => {
    toast.success("Logged out successfully");
  };

  return (
    <div className="bg-white">
      <div className="section-padding container max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="heading-section mb-2">My Account</h1>
            <p className="text-gray-600">ahmed@example.com</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab("orders")}
            className={`pb-4 font-semibold transition-colors ${
              tab === "orders"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setTab("addresses")}
            className={`pb-4 font-semibold transition-colors ${
              tab === "addresses"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Addresses
          </button>
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {MOCK_ORDERS.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No orders yet</p>
                <Link href="/shop">
                  <Button className="btn-primary">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">{order.items} items</p>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-orange-500">{order.total} LE</p>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {tab === "addresses" && (
          <div className="space-y-4">
            {MOCK_ADDRESSES.map((address) => (
              <div
                key={address.id}
                className={`p-6 border-2 rounded-lg transition-colors ${
                  address.isDefault ? "border-orange-500 bg-orange-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{address.name}</h3>
                    {address.isDefault && (
                      <span className="inline-block mt-2 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-700 mb-2">{address.address}</p>
                <p className="text-gray-700 mb-2">{address.city}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>
            ))}

            <Button className="w-full btn-secondary">+ Add New Address</Button>
          </div>
        )}
      </div>
    </div>
  );
}
