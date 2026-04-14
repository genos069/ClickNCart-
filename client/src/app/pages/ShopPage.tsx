import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Star, Grid3x3, List, SlidersHorizontal } from "lucide-react";
import { products } from "../data/products";
import { searchProducts } from "../../services/productServices";

export function ShopPage() {
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

  const location = useLocation();

  // ✅ FETCH DATA PROPERLY
  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const search = params.get("search");

      if (!search) return;

      try {
        setLoading(true);

        const data = await searchProducts({ search });

        // console.log("Shop products:", data);

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

  // ✅ Categories (can later come from API)
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // ✅ Use API data first
  const baseProducts = apiProducts.length ? apiProducts : products;

  const filteredProducts = baseProducts.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesCategory && matchesPrice;
  });

  // ✅ LOADING UI
  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Shop All Products</h1>
        <p className="text-gray-600">
          Discover our complete collection of premium products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64">
          <Card className="p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Filters</h2>

            {/* Categories */}
            {categories.map((category) => (
              <div key={category} className="flex gap-2">
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label>{category}</Label>
              </div>
            ))}
          </Card>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <p className="mb-4">Showing {filteredProducts.length} products</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="p-4">
                  <img
                    src={product.image}
                    className="h-48 w-full object-cover"
                  />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
