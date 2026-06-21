import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { ASSETS } from "@/assets";
import { SIZES } from "@shared/const";

const MOCK_PRODUCT_DATA: Record<string, any> = {
  "oversized-tee": {
    id: 1,
    name: "Oversized T-Shirt",
    price: 650,
    category: "T-Shirts",
    description:
      "Premium oversized t-shirt crafted from 100% organic cotton. Designed for comfort and style, this piece is a streetwear essential.",
    images: [ASSETS.products.tee.compressed, ASSETS.products.tee.compressed],
    colors: ["Black", "White", "Navy"],
    sizes: SIZES,
    sizeGuide: "Designed to fit oversized. For a standard fit, size down one size.",
    inStock: true,
    relatedProducts: [
      { id: 2, name: "Wide-Leg Denim", price: 1100, image: ASSETS.products.denim.compressed },
      { id: 3, name: "Heavyweight Hoodie", price: 1200, image: ASSETS.products.hoodie.compressed },
    ],
  },
  "wide-leg-denim": {
    id: 2,
    name: "Wide-Leg Denim",
    price: 1100,
    category: "Denim",
    description:
      "Structured wide-leg denim with premium Japanese selvedge. A timeless piece that defines modern streetwear.",
    images: [ASSETS.products.denim.compressed, ASSETS.products.denim.compressed],
    colors: ["Indigo", "Black"],
    sizes: SIZES,
    sizeGuide: "True to size. Designed for a relaxed, wide-leg fit.",
    inStock: true,
    relatedProducts: [
      { id: 1, name: "Oversized T-Shirt", price: 650, image: ASSETS.products.tee.compressed },
      { id: 3, name: "Heavyweight Hoodie", price: 1200, image: ASSETS.products.hoodie.compressed },
    ],
  },
  "heavyweight-hoodie": {
    id: 3,
    name: "Heavyweight Hoodie",
    price: 1200,
    category: "Hoodies",
    description:
      "Heavyweight hoodie constructed from premium French terry. Built for substance, presence, and pure comfort.",
    images: [ASSETS.products.hoodie.compressed, ASSETS.products.hoodie.compressed],
    colors: ["Black", "Charcoal"],
    sizes: SIZES,
    sizeGuide: "Designed for a comfortable, slightly oversized fit.",
    inStock: true,
    relatedProducts: [
      { id: 1, name: "Oversized T-Shirt", price: 650, image: ASSETS.products.tee.compressed },
      { id: 2, name: "Wide-Leg Denim", price: 1100, image: ASSETS.products.denim.compressed },
    ],
  },
};

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const slug = params?.slug || "oversized-tee";
  const product = MOCK_PRODUCT_DATA[slug];

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="section-padding container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden h-96 md:h-[600px]">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === idx ? "border-accent" : "border-border"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="heading-section mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-accent mb-4">{product.price} LE</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Color</label>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Size</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{product.sizeGuide}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 btn-primary">
                  <Check className="mr-2 w-5 h-5" />
                  Add to Cart
                </Button>
              </div>

              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className="w-full"
              >
                <Heart
                  className={`mr-2 w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Stock Status */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">✓ In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="heading-subsection mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.relatedProducts.map((related: any) => (
                <div key={related.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 bg-muted h-80">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{related.name}</h3>
                  <p className="text-2xl font-bold text-accent">{related.price} LE</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
