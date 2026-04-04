import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, Heart, ShoppingCart, Tag, Clock, Percent } from "lucide-react";
import { products } from "../data/products";

export function SalePage() {
  const [sortBy, setSortBy] = useState("discount");
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  // Add discount info to products
  const saleProducts = products.map((product) => ({
    ...product,
    discount: product.discount || Math.floor(Math.random() * 50) + 10,
    originalPrice: product.originalPrice || product.price * 1.5,
    stockLeft: Math.floor(Math.random() * 20) + 5,
  }));

  const sortedProducts = [...saleProducts].sort((a, b) => {
    if (sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const topDeals = sortedProducts.slice(0, 3);
  const flashSale = sortedProducts.slice(3, 7);

  return (
    <div>
      {/* Hero Banner with Timer */}
      <section className="relative bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <Badge className="mb-4 bg-white text-red-600 border-0 text-lg px-6 py-2">
              <Tag className="w-5 h-5 mr-2" />
              Limited Time Only
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">MEGA SALE</h1>
            <p className="text-2xl mb-8 text-red-100">Up to 70% OFF on selected items</p>
            
            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-lg">
                <p className="text-4xl font-bold">{timeLeft.hours}</p>
                <p className="text-sm">Hours</p>
              </div>
              <div className="text-4xl font-bold">:</div>
              <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-lg">
                <p className="text-4xl font-bold">{timeLeft.minutes}</p>
                <p className="text-sm">Minutes</p>
              </div>
              <div className="text-4xl font-bold">:</div>
              <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-lg">
                <p className="text-4xl font-bold">{timeLeft.seconds}</p>
                <p className="text-sm">Seconds</p>
              </div>
            </div>

            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8">
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center border-2 border-red-100 bg-gradient-to-br from-red-50 to-orange-50">
            <Percent className="w-10 h-10 mx-auto mb-2 text-red-600" />
            <p className="text-3xl font-bold text-red-600 mb-1">70%</p>
            <p className="text-sm text-gray-600">Max Discount</p>
          </Card>
          <Card className="p-6 text-center border-2 border-pink-100 bg-gradient-to-br from-pink-50 to-red-50">
            <Tag className="w-10 h-10 mx-auto mb-2 text-pink-600" />
            <p className="text-3xl font-bold text-pink-600 mb-1">{saleProducts.length}</p>
            <p className="text-sm text-gray-600">Items on Sale</p>
          </Card>
          <Card className="p-6 text-center border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50">
            <Clock className="w-10 h-10 mx-auto mb-2 text-orange-600" />
            <p className="text-3xl font-bold text-orange-600 mb-1">24h</p>
            <p className="text-sm text-gray-600">Time Left</p>
          </Card>
          <Card className="p-6 text-center border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-green-600" />
            <p className="text-3xl font-bold text-green-600 mb-1">Free</p>
            <p className="text-sm text-gray-600">Shipping on $50+</p>
          </Card>
        </div>

        {/* Top Deals Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                🔥 Today's Top Deals
              </h2>
              <p className="text-gray-600">Don't miss these incredible offers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topDeals.map((product, index) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden border-2 border-red-200 hover:border-red-300 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Deal Number Badge */}
                <div className="absolute top-4 left-4 z-10 w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  #{index + 1}
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xl px-4 py-2 shadow-lg">
                    -{product.discount}%
                  </Badge>
                </div>

                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 h-72">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-6">
                  <p className="text-xs text-red-600 mb-2 font-semibold">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-red-600">${product.price}</span>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-semibold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      ⚡ Only <span className="font-bold">{product.stockLeft}</span> left in stock!
                    </p>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-lg h-12">
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flash Sale Section */}
        <div className="mb-16 p-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ⚡ Flash Sale
              </h2>
              <p className="text-gray-600">Limited quantity - First come, first served!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Ends in</p>
              <p className="text-2xl font-bold text-orange-600">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {flashSale.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                      -{product.discount}%
                    </Badge>
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-orange-600">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Buy Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Sale Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                All Sale Items
              </h2>
              <p className="text-gray-600">Browse our entire sale collection</p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border border-red-100 hover:border-red-300 hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-pink-600 border-0">
                      -{product.discount}%
                    </Badge>
                  </div>
                </Link>

                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-lg font-bold text-red-600">${product.price}</span>
                    <span className="text-xs text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-semibold">
                    Add to Cart
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sale Info Banner */}
        <Card className="mt-16 p-8 border-2 border-red-200 bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 text-white">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-3">Don't Miss Out!</h3>
            <p className="text-xl mb-6 text-red-100">
              Sale ends in 24 hours. Shop now and save big on your favorite products!
            </p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8">
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
