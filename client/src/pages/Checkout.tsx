import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("confirmation");
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = step; // capture before TS narrows below
  // stepValue is the same value but typed as string so TS doesn't narrow it
  // after the confirmation early-return below, allowing progress bar comparisons.
  const stepValue = step as string;

  if (currentStep === "confirmation") {
    return (
      <div style={{ backgroundColor: "var(--momo-bg)" }}>
        <div className="section-padding container max-w-2xl">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="heading-section mb-4">Order Confirmed!</h1>
            <p className="text-lg text-dim mb-2">Thank you for your purchase.</p>
            <p className="text-dim mb-8">
              Your order has been placed and will be delivered soon. We'll contact you at{" "}
              <strong>{formData.phone}</strong> with delivery details.
            </p>

            <div className="surface p-6 rounded-lg mb-8 text-left">
              <h2 className="font-bold mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dim">Order ID:</span>
                  <span className="font-semibold">#ORD-2026-001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Delivery to:</span>
                  <span className="font-semibold">
                    {formData.address}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Estimated Delivery:</span>
                  <span className="font-semibold">3-5 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Payment Method:</span>
                  <span className="font-semibold">Cash on Delivery</span>
                </div>
              </div>
            </div>

            <Link href="/">
              <Button className="btn-primary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--momo-bg)" }}>
      <div className="section-padding container max-w-2xl">
        <h1 className="heading-section mb-8">Checkout</h1>

        {/* Progress Indicator */}
        <div className="flex gap-4 mb-12">
          <div
            className={`flex-1 h-1 rounded-full ${
              stepValue !== "shipping" ? "bg-accent" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex-1 h-1 rounded-full ${
              stepValue === "payment" || stepValue === "confirmation"
                ? "bg-accent"
                : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex-1 h-1 rounded-full ${
              stepValue === "confirmation" ? "bg-accent" : "bg-gray-200"
            }`}
          ></div>
        </div>

        {step === "shipping" && (
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <div>
              <h2 className="heading-subsection mb-6">Shipping Address</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name *</label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ahmed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name *</label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Hassan"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ahmed@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Phone *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+20 (123) 456-7890"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Address *</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">City *</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Cairo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Postal Code</label>
                  <Input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary">
                Continue to Payment
              </Button>
            </div>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <h2 className="heading-subsection mb-6">Payment Method</h2>

              <div className="surface p-6 rounded-lg mb-6 border-2 border-accent">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Cash on Delivery</h3>
                    <p className="text-dim">
                      Pay when your order arrives. No payment required now.
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface p-6 rounded-lg mb-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4 pb-4 border-b border-momo">
                  <div className="flex justify-between">
                    <span className="text-dim">Subtotal</span>
                    <span>2,850 LE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">Shipping</span>
                    <span>50 LE</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl text-accent">2,900 LE</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>

              <Button
                type="button"
                onClick={() => setStep("shipping")}
                variant="outline"
                className="w-full"
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
