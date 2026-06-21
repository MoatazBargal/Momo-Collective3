import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="section-padding-sm border-b border-border">
        <div className="container">
          <h1 className="heading-section mb-2">About Momo Collective</h1>
          <p className="text-muted-foreground">Built for culture. Driven by individuality.</p>
        </div>
      </section>

      {/* Main Story */}
      <section className="section-padding container">
        <div className="max-w-3xl">
          <h2 className="heading-subsection mb-6">Our Mission</h2>
          <div className="space-y-4 text-lg leading-relaxed mb-12">
            <p>
              Momo Collective is rooted in street culture. We create pieces that speak to the
              confident, the bold, the unapologetically individual. Every garment is designed
              with intention—built to last, crafted to inspire.
            </p>
            <p>
              We believe in raw authenticity. No pretense. No compromise. Just quality menswear
              that captures the gritty energy of urban life, refined through meticulous
              execution. Our designs reflect the streets—the energy, the attitude, the
              unfiltered realness.
            </p>
            <p>
              This is more than fashion. It's a movement for those who refuse to blend in.
              For the individuals who understand that style is a statement, not a whisper.
            </p>
          </div>

          <h2 className="heading-subsection mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-xl mb-3">Authenticity</h3>
              <p className="text-muted-foreground">
                We don't follow trends—we set them. Our pieces are born from genuine street
                culture, not boardroom meetings.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3">Quality</h3>
              <p className="text-muted-foreground">
                Premium materials, meticulous craftsmanship. Every stitch matters. Every piece
                is built to last.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3">Individuality</h3>
              <p className="text-muted-foreground">
                Your style is your identity. We create pieces that let you express who you
                are without compromise.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                Premium doesn't mean exclusive. We believe in quality streetwear that's
                within reach.
              </p>
            </div>
          </div>

          <h2 className="heading-subsection mb-6">The Collection</h2>
          <p className="text-lg leading-relaxed mb-8">
            Our debut collection features three essential pieces, each designed to be a
            foundation in your wardrobe. From oversized tees to structured denim to heavyweight
            hoodies—every item is a statement.
          </p>

          <div className="bg-muted/50 p-8 rounded-lg mb-12">
            <h3 className="font-bold text-xl mb-4">Why Choose Momo Collective?</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>Premium materials sourced for durability and comfort</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>Designed with street culture in mind, refined with precision</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>Limited quantities to maintain exclusivity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>Fast, reliable shipping across Egypt</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>Dedicated customer support</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link href="/shop">
              <Button className="btn-primary">
                Explore the Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
