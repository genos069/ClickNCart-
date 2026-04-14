import { Outlet, Link, useLocation } from "react-router";
import { ShoppingCart, Search, Menu, User, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { searchProducts } from "../../services/productServices";
import { useNavigate } from "react-router";

export function Layout() {
  const location = useLocation();
  const [cartCount] = useState(3);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ClickNCart
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full flex items-center gap-2">
                {/* Input */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Button (appears only when typing) */}
                {search.trim() !== "" && (
                  <Button
                    onClick={handleSearch}
                    className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                  >
                    Search
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:text-pink-600 relative"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:text-blue-600"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:text-blue-600"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-600 to-purple-600">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 py-3 border-t border-blue-100">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                location.pathname === "/"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-sm transition-colors ${
                location.pathname === "/shop"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Shop
            </Link>
            <Link
              to="/brands"
              className={`text-sm transition-colors ${
                location.pathname === "/brands"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Brands
            </Link>
            <Link
              to="/sale"
              className={`text-sm transition-colors ${
                location.pathname === "/sale"
                  ? "text-red-600 font-semibold"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              Sale
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-blue-900 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">
                  ClickNCart
                </span>
              </div>
              <p className="text-sm text-blue-200">
                Your destination for premium tech and lifestyle products.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Shop</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sale
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Categories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Help</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Newsletter</h3>
              <p className="text-sm text-blue-200 mb-3">
                Subscribe to get special offers and updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-blue-700 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-blue-300"
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm text-blue-200">
            © 2026 ClickNCart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
