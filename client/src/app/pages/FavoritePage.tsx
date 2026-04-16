import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Heart, ShoppingCart, X, ArrowRight, Share2 } from "lucide-react";
import { products } from "../data/products";

export function FavoritesPage() {
  const [favorites, setFavorites] = useState([
    products[0],
    products[2],
    products[4],
    products[6],
    products[8],
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const totalValue = favorites.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = favorites.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price);
    }
    return sum;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Favorites
          </h1>
        </div>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {favorites.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl mb-4">No favorites yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start adding products to your favorites list to keep track of items you love!
          </p>
          <Link to="/shop">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Discover Products <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {favorites.length}
                  </p>
                </div>
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
            </Card>
            
            <Card className="p-6 border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Value</p>
                  <p className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${totalValue}
                  </p>
                </div>
                <ShoppingCart className="w-12 h-12 text-blue-500" />
              </div>
            </Card>
            
            <Card className="p-6 border border-blue-100 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                  <p className="text-3xl font-semibold text-green-600">
                    ${totalSavings}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-lg px-4 py-2">
                  Save
                </Badge>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="mr-2 w-4 h-4" />
              Share List
            </Button>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => setFavorites([])}
            >
              <X className="mr-2 w-4 h-4" />
              Clear All
            </Button>
          </div>

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <Card 
                key={product.id} 
                className="group relative overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group/btn"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover/btn:scale-110 transition-transform" />
                </button>

                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 border-0">
                        -{product.discount}%
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-blue-600 mb-1 font-semibold">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-semibold text-blue-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Add All to Cart Section */}
          <Card className="p-8 mt-12 border border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to purchase?
                </h3>
                <p className="text-gray-600">
                  Add all your favorite items to cart and complete your purchase today.
                  {totalSavings > 0 && (
                    <span className="block mt-1 font-semibold text-green-600">
                      You could save ${totalSavings} on these items!
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop">
                  <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Continue Shopping
                  </Button>
                </Link>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
