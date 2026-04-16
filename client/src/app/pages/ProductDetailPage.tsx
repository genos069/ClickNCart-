import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  Package,
} from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productServices";

export function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!id) return;

      const res = await getRelatedProducts(id);
      setRelatedProducts(res?.data?.data ?? res?.data ?? null);
    };

    fetchRelated();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const res = await getProductById(id);

        setProduct(res?.data?.data ?? res?.data ?? null);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ LOADING STATE FIRST
  if (loading) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  // ✅ NOT FOUND ONLY AFTER LOADING IS DONE
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-blue-100 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-blue-600">
              Shop
            </Link>
            <span>/</span>
            <span className="text-blue-600">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Details - Design 9: Split layout with gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {product.discount && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 border-0 text-lg px-4 py-2">
                  -{product.discount}% OFF
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 transition-colors ${
                    selectedImage === i ? "border-blue-600" : "border-blue-100"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-3 bg-blue-100 text-blue-600 border-0">
              {product.category}
            </Badge>
            <h1 className="text-4xl mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge
                    variant="destructive"
                    className="text-base px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 border-0"
                  >
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">
                    In Stock - Ships within 24 hours
                  </span>
                </div>
              ) : (
                <div className="text-red-600 font-semibold">Out of Stock</div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-blue-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-blue-50 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 border-x border-blue-200 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-blue-50 transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!product.inStock}
              >
                Add to Cart - ${product.price * quantity}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">2-Year Warranty</p>
                  <p className="text-sm text-gray-600">
                    Full coverage included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Design 10: Tabbed content */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-blue-200 rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100"
                  >
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">{feature}</p>
                      <p className="text-sm text-gray-600">
                        Premium quality specification
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Submission Form */}
                <Card className="p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Write a Review
                  </h3>
                  <form className="space-y-4">
                    {/* Star Rating Input */}
                    <div>
                      <Label className="mb-2 block">Your Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" className="group">
                            <Star className="w-8 h-8 text-gray-300 hover:text-amber-400 hover:fill-amber-400 transition-colors cursor-pointer" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <Label htmlFor="review-title">Review Title</Label>
                      <Input
                        id="review-title"
                        type="text"
                        placeholder="Sum up your experience"
                        className="mt-2 border-blue-200 focus:ring-blue-500"
                      />
                    </div>

                    {/* Review Text */}
                    <div>
                      <Label htmlFor="review-text">Your Review</Label>
                      <textarea
                        id="review-text"
                        rows={4}
                        placeholder="Share your thoughts about this product..."
                        className="mt-2 w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="review-name">Your Name</Label>
                        <Input
                          id="review-name"
                          type="text"
                          placeholder="John Doe"
                          className="mt-2 border-blue-200 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="review-email">
                          Email (won't be published)
                        </Label>
                        <Input
                          id="review-email"
                          type="email"
                          placeholder="you@example.com"
                          className="mt-2 border-blue-200 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label htmlFor="review-images">
                        Add Photos (optional)
                      </Label>
                      <div className="mt-2 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                          id="review-images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <label
                          htmlFor="review-images"
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600">
                              Click to upload photos
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Verified Purchase */}
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="verified"
                        className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="verified"
                        className="text-sm text-gray-600"
                      >
                        I certify that this review is based on my own experience
                        and is my genuine opinion
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Submit Review
                    </Button>
                  </form>
                </Card>

                {/* Existing Reviews */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Customer Reviews ({product.reviews})
                  </h3>

                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-6 border border-blue-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">Customer {i + 1}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, j) => (
                                    <Star
                                      key={j}
                                      className={`w-4 h-4 ${
                                        j < 4
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                  Verified Purchase
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(2026, 3, 9 - i).toLocaleDateString()}
                            </p>
                          </div>
                          <h4 className="font-semibold mb-2">Great product!</h4>
                          <p className="text-gray-600 mb-3">
                            This product exceeded my expectations. The quality
                            is outstanding and it works perfectly. Highly
                            recommend!
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="text-gray-600 hover:text-blue-600 transition-colors">
                              👍 Helpful ({Math.floor(Math.random() * 20) + 5})
                            </button>
                            <button className="text-gray-600 hover:text-blue-600 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Load More Reviews
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                >
                  <Card className="group overflow-hidden border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{relatedProduct.rating}</span>
                      </div>
                      <p className="text-lg font-semibold text-blue-600">
                        ${relatedProduct.price}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
