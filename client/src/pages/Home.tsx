import { Link } from "wouter";
import { ASSETS } from "@/assets";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

export default function Home() {
  return (
    <div style={{ backgroundColor: "var(--momo-bg)" }}>
      {/* ===== HERO ===== */}
      <section className="relative w-full h-[calc(100vh-7rem)] min-h-[520px] overflow-hidden">
        <img
          src={ASSETS.heroBanner.compressed}
          alt="Momo Collective"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Gradient scrim for legibility */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.5) 100%)" }}
        />
        <div className="relative h-full container flex flex-col justify-end pb-16 md:pb-24">
          <span className="eyebrow mb-4">Summer Drop · 2026</span>
          <h1 className="heading-hero text-white max-w-4xl mb-6">
            Wear the<br />
            <span className="text-accent">Statement.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl mb-8">
            Built for culture. Driven by individuality. Raw streetwear for those who refuse to blend in.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <button className="btn-primary inline-flex items-center gap-2">
                Shop the Collection <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-outline-light">Our Story</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LATEST DROP ===== */}
      <section className="section-padding container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow mb-2 block">Just Landed</span>
            <h2 className="heading-section">Latest Drop</h2>
          </div>
          <Link href="/shop">
            <span className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-white hover:text-accent transition-colors cursor-pointer"
              style={{ fontFamily: "var(--font-display)" }}>
              View all <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== BRAND STATEMENT ===== */}
      <section className="surface border-y border-momo">
        <div className="container section-padding">
          <div className="max-w-4xl">
            <span className="eyebrow mb-4 block">The Movement</span>
            <h2 className="heading-section mb-8 leading-tight">
              No pretense.<br />No compromise.<br /><span className="text-accent">Just presence.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/70 text-lg leading-relaxed">
              <p>
                Momo Collective is rooted in street culture. Every garment is designed with
                intention — built to last, crafted to inspire the confident and the bold.
              </p>
              <p>
                We believe in raw authenticity. Quality menswear that captures the gritty energy
                of urban life, refined through meticulous execution. This is more than fashion.
              </p>
            </div>
            <Link href="/about">
              <button className="btn-outline-light mt-10">Learn More</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="bg-accent">
        <div className="container py-16 md:py-20 text-center">
          <h2 className="heading-section text-white mb-4">Ready to Stand Out?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Explore the full collection and find your next statement piece.
          </p>
          <Link href="/shop">
            <button className="bg-white text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-display)", borderRadius: 0 }}>
              Shop Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
