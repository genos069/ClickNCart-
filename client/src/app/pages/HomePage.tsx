import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Star, Truck, Shield, Zap, CreditCard } from "lucide-react";
import { products } from "../data/products";
import { useEffect, useState } from "react";

export function HomePage() {
const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Spring Collection 2026",
      subtitle: "Discover the latest in tech and lifestyle. Up to 30% off on selected items.",
      badge: "Limited Time Offer",
      gradient: "from-blue-900 via-purple-900 to-indigo-900",
    },
    {
      title: "Summer Sale Event",
      subtitle: "Beat the heat with hot deals! Save up to 50% on electronics.",
      badge: "Flash Sale",
      gradient: "from-orange-600 via-red-600 to-pink-600",
    },
    {
      title: "New Arrivals",
      subtitle: "Check out the newest products just added to our collection.",
      badge: "Just Landed",
      gradient: "from-green-600 via-teal-600 to-blue-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 8);

  return (
    <div>
      {/* Hero Section - Design 1: Full-width with overlay */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="flex flex-col transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateY(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`relative min-h-[600px] bg-gradient-to-br ${slide.gradient} flex-shrink-0`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0">
                    {slide.badge}
                  </Badge>
                  <h1 className="text-5xl md:text-6xl mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 text-blue-100">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/shop">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                        Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900">
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features - Design 2: Icon grid */}
      <section className="py-12 border-b border-blue-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Fast Delivery</h3>
                <p className="text-sm text-gray-600">2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Design 3: Large cards with hover effects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 border-0">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-600 mb-1 font-semibold">{product.category}</p>
                    <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-blue-600">${product.price}</span>
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
        </div>
      </section>

      {/* Banner - Design 4: Split screen promo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={products[2].image}
                alt="Wearables"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-purple-900/40" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-3xl mb-2">Smart Wearables</h3>
                <p className="mb-4 text-blue-100">Track your fitness goals</p>
                <Button variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-blue-900">
                  Shop Wearables <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={products[4].image}
                alt="Photography"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-pink-900/40" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-3xl mb-2">Photography Gear</h3>
                <p className="mb-4 text-purple-100">Capture every moment</p>
                <Button variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-purple-900">
                  Shop Cameras <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products - Design 5: Compact grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Trending Now</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what's hot right now. These products are flying off the shelves.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="group">
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 mb-3 border border-blue-100 group-hover:border-blue-300 transition-colors">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-sm font-semibold text-blue-600">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Design 6: Centered CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4">Stay in the Loop</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and tech tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}