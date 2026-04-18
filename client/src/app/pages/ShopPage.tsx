import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";

import { Star, Grid3x3, List, SlidersHorizontal } from "lucide-react";

import { searchProducts } from "../../services/productServices";

export function ShopPage() {
  // Shop Page

  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brandFromUrl = params.get("brand");

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 3000]);
    setSortBy("featured");
    setSelectedRating(null);
    setInStockOnly(false);
  };
  // =========================
  // FETCH FROM BACKEND (Code 2 logic)
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const search = params.get("search");
      const brand = params.get("brand");

      try {
        setLoading(true);

        const data = await searchProducts({
          search: search || "",
          brand: brand || "",
          limit: 80, // optional safety (frontend override)
        });

        setApiProducts(
          data.data.map((p: any) => ({
            ...p,
            id: p._id || p.id,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);
  // =========================
  // FALLBACK DATA
  // =========================
  const baseProducts = apiProducts;

  // =========================
  // FILTERS (Code 2 logic + Code 1 richness)
  // =========================
  const categories = Array.from(new Set(apiProducts.map((p) => p.category)));

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredProducts = apiProducts.filter((product) => {
    const matchesBrand = !brandFromUrl || product.brand === brandFromUrl;

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    const matchesRating = selectedRating
      ? product.rating >= selectedRating
      : true;

    const matchesStock = inStockOnly ? product.inStock : true;

    return (
      matchesBrand &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesStock
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "rating":
        return b.rating - a.rating;

      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "featured":
      default:
        return 0; // no sorting
    }
  });

  // =========================
  // LOADING UI
  // =========================
  if (!loading && apiProducts.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">No products found.</p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Shop All Products</h1>
        <p className="text-gray-600">
          Discover our complete collection of premium products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Design 7: Advanced filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card className="p-6 sticky top-24 border border-blue-100">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-lg text-slate-800">Filters</h2>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label
                      htmlFor={category}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={3000}
                step={50}
                className="mb-3"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((rating) => (
                  <div
                    key={rating}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedRating === rating}
                      onCheckedChange={() =>
                        setSelectedRating(
                          selectedRating === rating ? null : rating,
                        )
                      }
                    />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{rating}+</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Availability</h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="in-stock"
                  checked={inStockOnly}
                  onCheckedChange={() => setInStockOnly(!inStockOnly)}
                />
                <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                  In Stock Only
                </Label>
              </div>
            </div>

            <Button
              onClick={clearFilters}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              variant="outline"
            >
              Clear All Filters
            </Button>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar - Design 8: Sort and view options */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              products
            </p>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>

              <div className="flex items-center gap-1 border border-blue-200 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products - Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="group overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 border-0">
                          -{product.discount.toFixed(0)}%
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-blue-600 mb-1 font-semibold">
                        {product.category}
                      </p>
                      <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-blue-600">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Products - List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="group overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.discount && (
                          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 border-0">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-blue-600 mb-1 font-semibold">
                            {product.category}
                          </p>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{product.rating}</span>
                            <span className="text-xs text-gray-500">
                              ({product.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-blue-600">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
