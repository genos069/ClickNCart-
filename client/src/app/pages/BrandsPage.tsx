import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Star, Check } from "lucide-react";
import { fetchBrands } from "../../services/brandService";
import { fetchProducts } from "../../services/productServices";

export function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [brandRes, productRes] = await Promise.all([
          fetchBrands(),
          fetchProducts(),
        ]);

        setBrands(brandRes.data || brandRes);
        setProducts(productRes.data || productRes);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredBrands = brands.filter((b) => b.featured);
  const allBrands = brands;

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-4 bg-white/20 backdrop-blur text-white border-0">
            Trusted Partners
          </Badge>
          <h1 className="text-5xl md:text-6xl mb-4">Our Brands</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Shop from the world's leading brands, all in one place
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Brands */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Brands
            </h2>
            <p className="text-gray-600">
              Our most popular and trusted partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredBrands.map((brand) => (
              <Card
                key={brand._id || brand.id}
                className="group relative overflow-hidden border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${brand.color} relative`}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 backdrop-blur text-white border-0">
                      Featured
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-16 h-16 -mt-12 bg-gradient-to-br ${brand.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                    >
                      {brand.logo}
                    </div>
                    <div className="flex-1 mt-2">
                      <h3 className="text-xl font-semibold mb-1">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {brand.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="text-center">
                      <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {brand.products}
                      </p>
                      <p className="text-xs text-gray-600">Products</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <p className="text-2xl font-semibold text-gray-900">
                          {brand.rating}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                  </div>
                  <Link to={`/brands/${brand._id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Explore {brand.name}{" "}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Brands Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Brands
            </h2>
            <p className="text-gray-600">
              Browse our complete collection of trusted brands
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allBrands.map((brand) => (
              <Card
                key={brand._id}
                className="group cursor-pointer border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedBrand(brand.id)}
              >
                <div className="p-6 text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${brand.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md group-hover:scale-110 transition-transform`}
                  >
                    {brand.logo}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {brand.products} products
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{brand.rating}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* See More Button */}
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 group"
              >
                See More Brands
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Why Shop Our Brands */}
        <Card className="mb-16 p-8 border border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <h2 className="text-3xl text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Shop Our Brands?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">100% Authentic</h3>
              <p className="text-sm text-gray-600">
                All products are guaranteed authentic and come with official
                warranties
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">
                Competitive pricing on all branded products with regular deals
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-600 to-orange-600 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">
                Dedicated customer service team to help with all your needs
              </p>
            </div>
          </div>
        </Card>

        {/* Sample Products */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Popular Products
            </h2>
            <p className="text-gray-600">Trending items from our top brands</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(products || []).slice(0, 4).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-600 mb-1 font-semibold">
                      {product.category}
                    </p>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      ${product.price}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
