import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, Heart, ShoppingCart, Zap, Gift, TrendingUp, Clock } from "lucide-react";
import { products } from "../data/products";

const dealCategories = [
  { id: "daily", name: "Daily Deals", icon: Clock, color: "from-blue-600 to-cyan-600" },
  { id: "lightning", name: "Lightning Deals", icon: Zap, color: "from-yellow-600 to-orange-600" },
  { id: "bundle", name: "Bundle Deals", icon: Gift, color: "from-purple-600 to-pink-600" },
  { id: "trending", name: "Trending Deals", icon: TrendingUp, color: "from-green-600 to-emerald-600" },
];

export function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState("daily");
  const [timeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  });

  // Enhanced products with deal information
  const dealsProducts = products.map((product, index) => ({
    ...product,
    discount: product.discount || Math.floor(Math.random() * 60) + 20,
    originalPrice: product.originalPrice || product.price * 1.8,
    dealType: dealCategories[index % 4].id,
    claimed: Math.floor(Math.random() * 500) + 100,
    totalAvailable: 1000,
    dealEndsIn: Math.floor(Math.random() * 24) + 1,
  }));

  const filteredDeals = dealsProducts.filter(p => p.dealType === selectedCategory);
  const hotDeals = dealsProducts.slice(0, 2);

  const currentCategory = dealCategories.find(c => c.id === selectedCategory);

  return (
    <div>
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-30 animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 bg-white/20 backdrop-blur px-6 py-2 rounded-full">
              <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="font-semibold text-lg">Hot Deals Alert!</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4">Amazing Deals</h1>
            <p className="text-2xl mb-8 text-yellow-100">
              Save big with our exclusive limited-time offers
            </p>

            {/* Animated Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-5xl font-bold">{dealsProducts.length}</p>
                <p className="text-yellow-100">Active Deals</p>
              </div>
              <div className="w-px h-16 bg-white/30"></div>
              <div className="text-center">
                <p className="text-5xl font-bold">80%</p>
                <p className="text-yellow-100">Max Savings</p>
              </div>
              <div className="w-px h-16 bg-white/30"></div>
              <div className="text-center">
                <p className="text-5xl font-bold">24/7</p>
                <p className="text-yellow-100">New Deals</p>
              </div>
            </div>

            <Button size="lg" className="bg-white text-orange-600 hover:bg-yellow-50 text-lg px-10 shadow-xl">
              <Zap className="mr-2 w-5 h-5" />
              Grab Deals Now
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Deal Categories */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {dealCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                    selectedCategory === category.id
                      ? "border-blue-300 shadow-xl scale-105"
                      : "border-gray-200 hover:border-blue-200 hover:shadow-lg"
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-semibold ${selectedCategory === category.id ? "text-blue-600" : ""}`}>
                      {category.name}
                    </h3>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Hot Deals Banner */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">🔥 Today's Hottest Deals</h2>
                  <p className="text-pink-100">Limited quantities available!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-pink-100 mb-1">Ends in</p>
                <div className="flex gap-2">
                  <div className="bg-white/20 backdrop-blur px-3 py-1 rounded">
                    <span className="text-2xl font-bold">{timeLeft.hours}</span>h
                  </div>
                  <div className="bg-white/20 backdrop-blur px-3 py-1 rounded">
                    <span className="text-2xl font-bold">{timeLeft.minutes}</span>m
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotDeals.map((product) => (
                <Card key={product.id} className="overflow-hidden border-0">
                  <div className="flex gap-4 p-4">
                    <Link to={`/product/${product.id}`} className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Badge className="mb-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        -{product.discount}% OFF
                      </Badge>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-600">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-orange-600">${product.price}</span>
                        <span className="text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Claimed: {product.claimed}/{product.totalAvailable}</span>
                          <span className="font-semibold text-orange-600">
                            {Math.round((product.claimed / product.totalAvailable) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                            style={{ width: `${(product.claimed / product.totalAvailable) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        <ShoppingCart className="mr-2 w-4 h-4" />
                        Grab Deal
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Category Deals Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            {currentCategory && (
              <>
                <div className={`w-12 h-12 bg-gradient-to-br ${currentCategory.color} rounded-xl flex items-center justify-center`}>
                  <currentCategory.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentCategory.name}
                  </h2>
                  <p className="text-gray-600">{filteredDeals.length} deals available</p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDeals.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Deal Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg text-base px-3 py-1">
                    -{product.discount}%
                  </Badge>
                </div>

                {/* Deal Timer */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {product.dealEndsIn}h left
                  </div>
                </div>

                {/* Favorite Button */}
                <button className="absolute top-14 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors group/btn">
                  <Heart className="w-5 h-5 text-gray-400 group-hover/btn:text-pink-500 transition-colors" />
                </button>

                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-xs text-blue-600 mb-1 font-semibold">{product.category}</p>
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

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Claimed</span>
                      <span className="font-semibold">{Math.round((product.claimed / product.totalAvailable) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${currentCategory?.color} rounded-full transition-all`}
                        style={{ width: `${(product.claimed / product.totalAvailable) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    Claim Deal
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscribe Section */}
        <Card className="p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <Gift className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-3">Get Deal Alerts</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Subscribe now and never miss out on our exclusive deals and offers!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button size="lg" className="bg-white text-purple-600 hover:bg-yellow-50 font-semibold">
                <Zap className="mr-2 w-5 h-5" />
                Subscribe
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
