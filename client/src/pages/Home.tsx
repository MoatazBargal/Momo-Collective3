import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ASSETS } from "@/assets";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen md:h-[600px] overflow-hidden">
        <img
          src={ASSETS.heroBanner.compressed}
          alt="Momo Collective Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-6 md:px-12">
            <h1 className="heading-hero mb-4">MOMO COLLECTIVE</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light">
              Built for culture. Driven by individuality. United by style.
            </p>
            <Link href="/shop">
              <Button className="btn-primary text-lg px-8 py-3">
                Explore the Collection <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding container">
        <div className="mb-12">
          <h2 className="heading-section mb-2">Latest Drop</h2>
          <div className="w-16 h-1 bg-accent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Oversized T-Shirt */}
          <Link href="/product/oversized-tee">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4 bg-muted h-80 md:h-96">
                <img
                  src={ASSETS.products.tee.compressed}
                  alt="Oversized T-Shirt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="heading-subsection mb-2">Oversized T-Shirt</h3>
              <p className="text-muted-foreground mb-3">Premium comfort. Bold presence.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">650 LE</span>
                <Button variant="outline" size="sm">
                  View <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Wide-Leg Denim */}
          <Link href="/product/wide-leg-denim">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4 bg-muted h-80 md:h-96">
                <img
                  src={ASSETS.products.denim.compressed}
                  alt="Wide-Leg Denim"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="heading-subsection mb-2">Wide-Leg Denim</h3>
              <p className="text-muted-foreground mb-3">Structured silhouette. Timeless edge.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">1,100 LE</span>
                <Button variant="outline" size="sm">
                  View <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Heavyweight Hoodie */}
          <Link href="/product/heavyweight-hoodie">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4 bg-muted h-80 md:h-96">
                <img
                  src={ASSETS.products.hoodie.compressed}
                  alt="Heavyweight Hoodie"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="heading-subsection mb-2">Heavyweight Hoodie</h3>
              <p className="text-muted-foreground mb-3">Substance and presence. Pure comfort.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">1,200 LE</span>
                <Button variant="outline" size="sm">
                  View <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="heading-section mb-6">Our Story</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Momo Collective is rooted in street culture. We create pieces that speak to the
                confident, the bold, the unapologetically individual. Every garment is designed
                with intention—built to last, crafted to inspire.
              </p>
              <p>
                We believe in raw authenticity. No pretense. No compromise. Just quality menswear
                that captures the gritty energy of urban life, refined through meticulous
                execution.
              </p>
              <p>
                This is more than fashion. It's a movement for those who refuse to blend in.
              </p>
            </div>
            <Link href="/about">
              <Button className="mt-8 btn-primary">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-accent text-accent-foreground">
        <div className="container text-center">
          <h2 className="heading-section mb-4">Ready to Stand Out?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our full collection and find your next statement piece.
          </p>
          <Link href="/shop">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
