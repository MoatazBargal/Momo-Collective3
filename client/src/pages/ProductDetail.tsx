import { useState } from "react";
import { Heart, Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { SIZES, CURRENCY_SYMBOL } from "@shared/const";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import SizeGuide from "@/components/SizeGuide";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProducts";

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const slug = params?.slug || "oversized-tee";
  const { product, related, loading } = useProduct(slug);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState<string>(SIZES[2]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading && !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: "var(--momo-bg)" }}>
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: "var(--momo-bg)" }}>
        <p className="text-lg text-dim">Product not found.</p>
      </div>
    );
  }

  const onSale = typeof product.compareAtPrice === "number";

  const handleAddToCart = () => {
    addItem({
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
    toast.success(`Added ${quantity} × ${product.name} (${selectedSize}) to cart`);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div style={{ backgroundColor: "var(--momo-bg)" }}>
      <div className="section-padding container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative surface overflow-hidden" style={{ aspectRatio: "3/4" }}>
              {onSale && (
                <span className="badge-sale">
                  Save {product.compareAtPrice! - product.price} {CURRENCY_SYMBOL}
                </span>
              )}
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                    currentImageIndex === idx ? "border-accent" : "border-momo"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <span className="eyebrow mb-2 block">
                {product.category === "tees" ? "T-Shirts" : product.category === "denim" ? "Denim" : "Hoodies"}
              </span>
              <h1 className="heading-section mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-accent" style={{ fontFamily: "var(--font-display)" }}>
                  {product.price} {CURRENCY_SYMBOL}
                </span>
                {onSale && (
                  <span className="text-xl text-dim line-through">
                    {product.compareAtPrice} {CURRENCY_SYMBOL}
                  </span>
                )}
              </div>
              <p className="text-lg leading-relaxed text-white/70">{product.description}</p>
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-dim">
                Color — <span className="text-white">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`swatch ${selectedColor === color.name ? "swatch--active" : ""}`}
                    style={{ backgroundColor: color.hex, width: "2rem", height: "2rem" }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-dim">Size</label>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-bold border-2 transition-all ${
                      selectedSize === size
                        ? "border-accent bg-accent text-white"
                        : "border-momo text-white hover:border-accent"
                    }`}
                    style={{ fontFamily: "var(--font-display)", borderRadius: 0 }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {product.sizeGuide && <p className="text-sm text-dim mb-3">{product.sizeGuide}</p>}
              <SizeGuide note={product.sizeGuide} />
            </div>

            {/* Quantity + Add */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-momo" style={{ borderRadius: 0 }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-white hover:text-accent">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-bold text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-white hover:text-accent">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> Add to Cart
                </button>
              </div>
              <button onClick={handleToggleWishlist} className="btn-outline-light w-full inline-flex items-center justify-center gap-2">
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Stock */}
            <div className="glass p-4" style={{ borderRadius: "12px" }}>
              <p className="text-sm">
                {product.inStock ? (
                  <span className="text-accent font-bold uppercase tracking-wide">● In Stock</span>
                ) : (
                  <span className="text-dim font-bold uppercase tracking-wide">Out of Stock</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-momo">
            <h2 className="heading-subsection mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Reviews */}
      <ProductReviews productId={product.id} />
    </div>
  );
}
