import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span
              className="font-bold text-2xl tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
            >
              MOMO<span className="text-orange-500">.</span>
            </span>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed max-w-xs">
              Built for culture. Driven by individuality. United by style.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
              Navigate
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/cart", label: "Cart" },
                { href: "/wishlist", label: "Wishlist" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>hello@momocollective.com</li>
              <li>+20 (123) 456-7890</li>
              <li>Cairo, Egypt</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Momo Collective. All rights reserved.</span>
          <span>Cairo, Egypt</span>
        </div>
      </div>
    </footer>
  );
}
