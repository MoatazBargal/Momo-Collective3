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
  const [scrolled, setScrolled] = useState(false);

  // Home page has a full-bleed hero — navbar starts transparent there and
  // turns to glass on scroll. Every other page is glass from the top.
  const isHome = location === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Close dropdown on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        transparent ? "bg-transparent" : "glass-nav"
      }`}
    >
      <nav className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: mobile menu toggle + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 -ml-2 text-white inline-flex items-center gap-1"
              aria-label="Menu"
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

          {/* Center: desktop nav */}
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

      {/* Mobile dropdown — compact, glass, sits under the header (NOT full-screen) */}
      {mobileOpen && (
        <>
          {/* Click-away backdrop (transparent, just for dismiss) */}
          <button
            className="md:hidden fixed inset-0 top-16 z-40 cursor-default"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden absolute left-4 right-4 top-full mt-2 z-50 glass-strong overflow-hidden"
            style={{ borderRadius: "14px" }}>
            <div className="py-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block px-5 py-3 text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                      isActive(link.href) ? "text-accent glass-accent" : "text-white hover:text-accent"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="border-t border-momo mt-1 pt-1">
                <Link href="/profile">
                  <span className="block px-5 py-3 text-sm font-bold uppercase tracking-widest text-dim hover:text-white transition-colors cursor-pointer">
                    My Account
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
