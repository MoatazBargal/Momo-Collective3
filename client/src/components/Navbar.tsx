import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, X, User, Search } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header className="sticky top-0 z-50 surface border-b border-momo">
      <nav className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: burger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 -ml-2 text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/">
              <span
                className="font-black text-2xl tracking-tight text-white cursor-pointer select-none"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}
              >
                MOMO<span className="text-accent">.</span>
              </span>
            </Link>
          </div>

          {/* Center: desktop nav links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                    isActive(link.href) ? "text-accent" : "text-white hover:text-accent"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <Link href="/shop">
              <button className="p-2 text-white hover:text-accent transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/wishlist">
              <button
                className={`p-2 transition-colors ${isActive("/wishlist") ? "text-accent" : "text-white hover:text-accent"}`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/profile">
              <button
                className={`hidden md:inline-flex p-2 transition-colors ${isActive("/profile") ? "text-accent" : "text-white hover:text-accent"}`}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/cart">
              <button
                className={`p-2 transition-colors ${isActive("/cart") ? "text-accent" : "text-white hover:text-accent"}`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40" style={{ background: "var(--momo-bg)" }}>
          <div className="container py-8 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block py-4 text-2xl font-black uppercase tracking-tight border-b border-momo transition-colors cursor-pointer ${
                    isActive(link.href) ? "text-accent" : "text-white"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/profile">
              <span className="block py-4 text-sm font-bold uppercase tracking-widest text-dim cursor-pointer mt-4">
                My Account
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
