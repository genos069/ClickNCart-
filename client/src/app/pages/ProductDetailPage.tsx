import type { Product, Review } from "../types";
import { getFavorites, toggleFavorite } from "../../services/favorites";
import { getSession } from "../../services/session";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { addToCart } from "../../services/cartServices";
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
import { submitReview, getProductReviews } from "../../services/reviewServices";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = getSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPages, setReviewPages] = useState(1);
  const [reviewBusy, setReviewBusy] = useState(false);
  useEffect(() => {
    setFavorite(getFavorites().includes(id || ""));
    setSelectedImage(0);
    setQuantity(1);
    setReviewPage(1);
  }, [id]);
  const [selectedImage, setSelectedImage] = useState(0);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!userInfo?.token) {
      navigate("/login");
      return;
    }

    if (rating === 0) {
      alert("Please select rating");
      return;
    }

    try {
      const reviewData = {
        productId: product._id,
        rating,
        title,
        comment: reviewText,
      };

      await submitReview(reviewData, userInfo.token);
      const [updatedReviews, updatedProduct] = await Promise.all([
        getProductReviews(id),
        getProductById(id),
      ]);
      setReviews(updatedReviews.data.data);
      setReviewPages(updatedReviews.data.pages);
      setReviewPage(1);
      setProduct(updatedProduct.data);

      alert("Review submitted");

      setRating(0);
      setTitle("");
      setReviewText("");
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!getSession()) {
      navigate("/login");
      return;
    }
    try {
      const userInfo = getSession();
      await addToCart(
        {
          productId: product._id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        userInfo.token,
      );
      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add ❌");
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getProductById(id),
      getProductReviews(id),
      getRelatedProducts(id),
    ])
      .then(([p, r, related]) => {
        if (active) {
          setProduct(p.data);
          setReviews(r.data.data || []);
          setReviewPages(r.data.pages || 1);
          setRelatedProducts(related.data || []);
        }
      })
      .catch(() => {
        if (active) setProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  // NOT FOUND ONLY AFTER LOADING IS DONE
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
                src={
                  (product.images?.length ? product.images : [product.image])[
                    selectedImage
                  ] || product.image
                }
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
              {(product.images?.length ? product.images : [product.image]).map(
                (image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 transition-colors ${
                      selectedImage === i
                        ? "border-blue-600"
                        : "border-blue-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ),
              )}
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
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="px-4 py-3 hover:bg-blue-50 transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!product.inStock}
              >
                Add to Cart - ${product.price * quantity}
              </Button>
              <Button
                size="lg"
                variant="outline"
                aria-label="Toggle favorite"
                aria-pressed={favorite}
                onClick={() =>
                  setFavorite(toggleFavorite(product._id).includes(product._id))
                }
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Heart
                  className={`w-5 h-5 ${favorite ? "fill-pink-500 text-pink-500" : ""}`}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                aria-label="Share product"
                onClick={async () => {
                  try {
                    if (navigator.share)
                      await navigator.share({
                        title: product.name,
                        url: location.href,
                      });
                    else {
                      await navigator.clipboard.writeText(location.href);
                      alert("Link copied");
                    }
                  } catch {}
                }}
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

                  {!userInfo ? (
                    <div className="text-center py-6">
                      <p className="mb-4 text-gray-600">
                        Please login to write a review
                      </p>
                      <Button
                        onClick={() => navigate("/login")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Go to Login
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Star Rating Input */}
                      <div>
                        <Label className="mb-2 block">Your Rating</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="group"
                            >
                              <Star
                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                  star <= rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300 group-hover:text-amber-400 group-hover:fill-amber-400"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Title */}
                      <div>
                        <Label htmlFor="review-title">Review Title</Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          type="text"
                          placeholder="Sum up your experience"
                          className="mt-2 border-blue-200 focus:ring-blue-500"
                        />
                      </div>

                      {/* Review Text */}
                      <div>
                        <Label htmlFor="review-text">Your Review</Label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
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
                            value={userInfo?.name || ""}
                            readOnly
                            className="mt-2 border-blue-200 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="review-email">
                            Email (won't be published)
                          </Label>
                          <Input
                            value={userInfo?.email || ""}
                            readOnly
                            className="mt-2 border-blue-200 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Submit Review
                      </Button>
                    </form>
                  )}
                </Card>

                {/* Existing Reviews */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Customer Reviews ({product.reviews})
                  </h3>

                  {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet</p>
                  ) : (
                    <>
                      {reviews.map((review, index) => (
                        <Card
                          key={review._id || index}
                          className="p-6 border border-blue-100"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold">
                                    {review.user?.name || "Unknown User"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    {review.verifiedPurchase && (
                                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt,
                                      ).toLocaleDateString()
                                    : ""}
                                </p>
                              </div>
                              <h4 className="font-semibold mb-2">
                                {review.title}
                              </h4>
                              <p className="text-gray-600 mb-3">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {reviewPage < reviewPages && (
                        <Button
                          disabled={reviewBusy}
                          variant="outline"
                          className="w-full"
                          onClick={async () => {
                            setReviewBusy(true);
                            try {
                              const response = await getProductReviews(
                                id,
                                reviewPage + 1,
                              );
                              setReviews((old) => [
                                ...old,
                                ...response.data.data,
                              ]);
                              setReviewPage((p) => p + 1);
                            } catch {
                              alert("Unable to load reviews");
                            } finally {
                              setReviewBusy(false);
                            }
                          }}
                        >
                          Load More Reviews
                        </Button>
                      )}
                    </>
                  )}
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
