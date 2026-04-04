import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, Heart, ShoppingCart, Sparkles, Clock, TrendingUp } from "lucide-react";
import { products } from "../data/products";

export function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Simulate new arrivals with recent dates
  const newArrivals = products.map((product, index) => ({
    ...product,
    arrivalDate: new Date(2026, 3, 4 - index), // Recent dates
    isNew: index < 8,
    trending: index % 3 === 0,
  }));

  const filteredProducts = selectedCategory === "all" 
    ? newArrivals 
    : newArrivals.filter(p => p.category === selectedCategory);

  const categories = ["all", "Audio", "Computers", "Wearables", "Photography", "Gaming"];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <Badge className="bg-white/20 backdrop-blur text-white border-0 text-lg px-4 py-1">
              Just Landed
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl text-center mb-4">New Arrivals</h1>
          <p className="text-xl text-center text-blue-100 max-w-2xl mx-auto">
            Discover the latest and greatest products that just arrived in our store
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {newArrivals.length}
                </p>
                <p className="text-gray-600">New Products</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border border-blue-100 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  24h
                </p>
                <p className="text-gray-600">Updated Daily</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border border-blue-100 bg-gradient-to-br from-orange-50 to-pink-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Hot
                </p>
                <p className="text-gray-600">Trending Items</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "border-blue-200 hover:bg-blue-50"
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                )}
                {product.trending && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 border-0 shadow-lg">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <button className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors group/btn">
                <Heart className="w-5 h-5 text-gray-400 group-hover/btn:text-pink-500 transition-colors" />
              </button>

              {/* Product Image */}
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-blue-600 font-semibold">{product.category}</p>
                  <p className="text-xs text-gray-500">
                    {product.arrivalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-blue-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-16 p-8 border border-blue-200 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-3xl font-semibold mb-3">Never Miss New Arrivals</h3>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter and be the first to know about new products
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
