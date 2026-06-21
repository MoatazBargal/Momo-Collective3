import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search, Grid3x3, List, ChevronRight } from "lucide-react";
import { ASSETS } from "@/assets";
import { PRODUCT_CATEGORIES } from "@shared/const";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Oversized T-Shirt",
    slug: "oversized-tee",
    category: "tees",
    price: 650,
    image: ASSETS.products.tee.compressed,
  },
  {
    id: 2,
    name: "Wide-Leg Denim",
    slug: "wide-leg-denim",
    category: "denim",
    price: 1100,
    image: ASSETS.products.denim.compressed,
  },
  {
    id: 3,
    name: "Heavyweight Hoodie",
    slug: "heavyweight-hoodie",
    category: "hoodies",
    price: 1200,
    image: ASSETS.products.hoodie.compressed,
  },
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS;

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="section-padding-sm border-b border-border">
        <div className="container">
          <h1 className="heading-section mb-2">Shop</h1>
          <p className="text-muted-foreground">Discover our collection</p>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="section-padding-sm border-b border-border sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="container space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All
            </Button>
            {Object.entries(PRODUCT_CATEGORIES).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                size="sm"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Sort & View Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-border bg-white dark:bg-slate-950 text-black dark:text-white text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding container">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 bg-muted h-80 md:h-96">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="heading-subsection mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{product.price} LE</span>
                    <Button variant="outline" size="sm">
                      View <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <div className="group cursor-pointer flex gap-6 p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="heading-subsection mb-1">{product.name}</h3>
                      <p className="text-muted-foreground">
                        {PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES]}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{product.price} LE</span>
                      <Button variant="outline" size="sm">
                        View <ChevronRight className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
