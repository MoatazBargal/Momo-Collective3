import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/">
            <span className="font-bold text-xl tracking-tight text-black cursor-pointer select-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}>
              MOMO<span className="text-orange-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "text-orange-500"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" aria-label="Wishlist"
                className={isActive("/wishlist") ? "text-orange-500" : ""}>
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" aria-label="Account"
                className={isActive("/profile") ? "text-orange-500" : ""}>
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                size="sm"
                className={`bg-black hover:bg-gray-900 text-white ml-2 ${
                  isActive("/cart") ? "ring-2 ring-orange-500 ring-offset-1" : ""
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                Cart
              </Button>
            </Link>
          </div>

          {/* Mobile: icons + burger */}
          <div className="flex md:hidden items-center gap-1">
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="sm" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <Link href="/profile">
                <span className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer">
                  My Account
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
