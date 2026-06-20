import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

const MOCK_CART_ITEMS: CartItem[] = [
  { id: 1, name: "Oversized T-Shirt", price: 650, quantity: 2, size: "L", color: "Black" },
  { id: 2, name: "Wide-Leg Denim", price: 1100, quantity: 1, size: "32", color: "Indigo" },
];

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="section-padding container">
          <h1 className="heading-section mb-8">Shopping Cart</h1>
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
            <Link href="/shop">
              <Button className="btn-primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="section-padding container">
        <h1 className="heading-section mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.color} • Size {item.size}
                  </p>
                  <p className="text-2xl font-bold text-orange-500">{item.price} LE</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{subtotal} LE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shipping} LE</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-orange-500">{total} LE</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full btn-primary">Proceed to Checkout</Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
