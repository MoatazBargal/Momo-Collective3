import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(mode === "login" ? "Logged in successfully!" : "Account created successfully!");
      setFormData({ email: "", password: "", confirmPassword: "", name: "" });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="mb-8">
          <h1 className="heading-section mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {mode === "login"
              ? "Sign in to your account to continue shopping"
              : "Join Momo Collective and start shopping"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ahmed Hassan"
                required={mode === "signup"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required={mode === "signup"}
              />
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full btn-primary">
            {isSubmitting
              ? "Processing..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setFormData({ email: "", password: "", confirmPassword: "", name: "" });
            }}
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
