import { useState } from "react";
import { Link } from "wouter";
import { Instagram, Send } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("You're on the list.");
    setEmail("");
  };

  return (
    <footer className="glass-nav mt-auto">
      {/* Newsletter band */}
      <div className="border-b border-momo glow-field overflow-hidden">
        <div className="container section-padding-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="heading-section mb-2">Join the Collective</h2>
              <p className="text-dim max-w-md">
                First access to drops, restocks, and members-only releases. No spam.
              </p>
            </div>
            <div className="flex gap-3 max-w-md md:ml-auto w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent border border-momo text-white px-4 py-3 placeholder:text-dim focus:outline-none focus:border-accent"
                style={{ borderRadius: 0 }}
              />
              <button onClick={handleSubscribe} className="btn-primary flex items-center gap-2" aria-label="Subscribe">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-black text-3xl tracking-tight" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
              MOMO<span className="text-accent">.</span>
            </span>
            <p className="mt-4 text-dim text-sm leading-relaxed max-w-xs">
              Built for culture. Driven by individuality. United by style.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-dim mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/cart", label: "Cart" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="text-sm text-white/80 hover:text-accent transition-colors cursor-pointer">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-dim mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="text-sm text-white/80 hover:text-accent transition-colors cursor-pointer">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-dim mb-4">Connect</h3>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-accent transition-colors">
              <Instagram className="w-4 h-4" /> Instagram
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-momo flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-dim">
          <span>© {new Date().getFullYear()} Momo Collective. All rights reserved.</span>
          <span>Cairo, Egypt</span>
        </div>
      </div>
    </footer>
  );
}
