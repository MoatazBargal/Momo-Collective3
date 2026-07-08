import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { CURRENCY_SYMBOL, WHATSAPP_NUMBER } from "@shared/const";
import { useCart } from "@/contexts/CartContext";
import { captureAbandonedCart } from "@/lib/api";
import { FREE_SHIPPING_OVER, SHIPPING_ZONES } from "@shared/shipping";

// Lowest zone fee, shown as an estimate before governorate is chosen
const MIN_SHIPPING = Math.min(...SHIPPING_ZONES.map((z) => z.fee));

const SHIPPING_ESTIMATE = MIN_SHIPPING;

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [savePhone, setSavePhone] = useState("");
  const [saved, setSaved] = useState(false);

  // Save the cart + phone so the brand can follow up (manual recovery)
  const handleSaveCart = async () => {
    const phone = savePhone.trim();
    if (!phone) return;
    try {
      await captureAbandonedCart({
        phone,
        items: items.map((it) => ({
          name: it.name, color: it.color, size: it.size, quantity: it.quantity, price: it.price,
        })),
        subtotal,
      });
      setSaved(true);
      toast.success("Saved! We'll hold your cart and reach out on WhatsApp.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save cart");
    }
  };

  // Build a pre-filled WhatsApp message with the cart contents
  const buildWhatsAppOrder = () => {
    const lines = items.map(
      (it) => `• ${it.name} (${it.color}/${it.size}) ×${it.quantity} — ${it.price * it.quantity} ${CURRENCY_SYMBOL}`
    );
    const msg =
      `مرحباً Momo Collective 👋\nحابب أطلب:\n\n${lines.join("\n")}\n\n` +
      `الإجمالي: ${subtotal} ${CURRENCY_SYMBOL}\n\nياريت تأكيد الطلب والتوصيل. شكراً!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const freeShipping = subtotal >= FREE_SHIPPING_OVER;
  const shipping = subtotal === 0 || freeShipping ? 0 : SHIPPING_ESTIMATE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: "var(--momo-bg)" }}>
        <div className="section-padding container">
          <h1 className="heading-section mb-8">Shopping Cart</h1>
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-dim" />
            <p className="text-xl text-dim mb-8">Your cart is empty</p>
            <Link href="/shop">
              <Button className="btn-primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--momo-bg)" }}>
      <div className="section-padding container glow-field overflow-hidden">
        <h1 className="heading-section mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="flex gap-6 p-6 glass glass-hover"
                style={{ borderRadius: "14px" }}
              >
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden surface-2" style={{ borderRadius: "10px" }}>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-dim mb-3">
                    {item.color} • Size {item.size}
                  </p>
                  <p className="text-2xl font-bold text-accent">{item.price} {CURRENCY_SYMBOL}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => removeItem(item.lineId)}
                    className="text-dim hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center border border-momo" style={{ borderRadius: "10px" }}>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="p-2 hover:surface-2"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="p-2 hover:surface-2"
                      aria-label="Increase quantity"
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
            <div className="glass p-6 sticky top-20" style={{ borderRadius: "16px" }}>
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-momo">
                <div className="flex justify-between">
                  <span className="text-dim">Subtotal</span>
                  <span className="font-semibold">{subtotal} {CURRENCY_SYMBOL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Shipping</span>
                  <span className="font-semibold">
                    {freeShipping ? "Free" : `from ${shipping} ${CURRENCY_SYMBOL}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < FREE_SHIPPING_OVER && (
                  <p className="text-xs text-dim">
                    Add {FREE_SHIPPING_OVER - subtotal} {CURRENCY_SYMBOL} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-accent">{total} {CURRENCY_SYMBOL}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full btn-primary">Proceed to Checkout</Button>
              </Link>

              <a
                href={buildWhatsAppOrder()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 font-bold uppercase tracking-wide transition-colors"
                style={{ backgroundColor: "#25D366", color: "#0a0a0a", borderRadius: "10px" }}
              >
                <MessageCircle className="w-5 h-5" /> Order via WhatsApp
              </a>

              <Link href="/shop">
                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>

              {/* Save cart for later — manual WhatsApp follow-up */}
              <div className="mt-6 pt-6 border-t border-momo">
                {saved ? (
                  <p className="text-sm text-accent text-center">
                    ✓ We've saved your cart — we'll reach out on WhatsApp.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-dim mb-2">Not ready? Save your cart & we'll follow up:</p>
                    <div className="flex gap-2">
                      <input
                        value={savePhone}
                        onChange={(e) => setSavePhone(e.target.value)}
                        placeholder="Your WhatsApp number"
                        className="flex-1 bg-transparent border border-momo text-[color:var(--momo-text)] px-3 py-2 text-sm placeholder:text-dim focus:outline-none focus:border-accent"
                        style={{ borderRadius: "8px" }}
                      />
                      <button
                        onClick={handleSaveCart}
                        disabled={!savePhone.trim()}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-white/10 hover:bg-white/20 text-[color:var(--momo-text)] disabled:opacity-50 transition-colors"
                        style={{ borderRadius: "8px" }}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
