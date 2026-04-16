import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { products } from "../data/products";
import {
  getCart,
  removeFromCart,
  clearCart,
  addToCart,
  applyPromo,
} from "../../services/cartServices";

export function CartPage() {

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // ✅ Get user
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");


  // 🟢 FETCH CART FROM BACKEND
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user) return;

        const { data } = await getCart(user.token);
        setCartItems(data.items || []);
        localStorage.setItem("cartCount", data.items.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, []);

  const handleApplyPromo = async () => {
    try {
      const { data } = await applyPromo(promoCode, user.token);

      setDiscount(data.discount);

      alert("Promo applied ✅");
    } catch (error: any) {
      alert(error.response?.data?.message || "Invalid code ❌");
    }
  };


  // ➕ INCREASE QUANTITY
  const increaseQuantity = async (item: any) => {
    try {
      const { data } = await addToCart(
        {
          productId: item.productId,
          name: item.name,
          price: item.price,
        },
        user.token
      );

      setCartItems(data.items);
      localStorage.setItem("cartCount", data.items.length);
    } catch (error) {
      console.log(error);
    }
  };


  // ➖ DECREASE QUANTITY (Frontend Adjust OR Backend API if you add later)
  const decreaseQuantity = async (item: any) => {
    if (item.quantity <= 1) return;

    const updated = cartItems.map((i) =>
      i.productId === item.productId
        ? { ...i, quantity: i.quantity - 1 }
        : i
    );

    setCartItems(updated);
  };


  // ❌ REMOVE ITEM
  const handleRemove = async (productId: string) => {
    try {
      const { data } = await removeFromCart(productId, user.token);
      setCartItems(data.items);
      localStorage.setItem("cartCount", data.items.length);
    } catch (error) {
      console.log(error);
    }
  };


  // 💰 CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;

  // 🟢 APPLY DISCOUNT
  let discountAmount = 0;

  // 👉 If percentage (recommended)
  discountAmount = (subtotal * discount) / 100;

  // 👉 If flat discount (use this instead if needed)
  // discountAmount = discount;

  const total = subtotal + shipping + tax - discountAmount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} items in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link to="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Design 11: Detailed cart layout */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6 border border-blue-100">
                <div className="flex gap-6">
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg bg-gradient-to-br from-blue-50 to-purple-50"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-blue-600 mb-4 font-semibold">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-blue-200 rounded-lg">
                        <button
                          onClick={() => decreaseQuantity(item)}
                          className="p-2 hover:bg-blue-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-blue-200 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item)}
                          className="p-2 hover:bg-blue-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${item.price * item.quantity}</p>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Promo Code */}
            <Card className="p-6 border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Have a promo code?</h3>
              </div>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border-blue-200 focus:ring-blue-500"
                />
                <Button
                  disabled={!promoCode}
                  onClick={handleApplyPromo}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Apply</Button>
              </div>
            </Card>
          </div>

          {/* Order Summary - Design 12: Sticky summary card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border border-blue-100">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-6 text-xl">
                <span className="font-semibold">Total</span>
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full mb-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link to="/shop">
                <Button variant="outline" size="lg" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  Continue Shopping
                </Button>
              </Link>

              {subtotal < 100 && (
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    Add <span className="font-semibold">${(100 - subtotal).toFixed(2)}</span> more to get <span className="font-semibold">FREE shipping</span>!
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Easy returns within 30 days</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}