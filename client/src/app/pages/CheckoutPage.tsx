import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Lock, CreditCard, Truck, Package, CheckCircle2 } from "lucide-react";
import { getCart, saveAddress } from "../../services/cartServices";
import { savePaymentMethod } from "../../services/paymentServices";
import { updateShippingMethod } from "../../services/cartServices";
import { placeOrder } from "../../services/orderServices";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartData, setCartData] = useState({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    discountAmount: 0,
    total: 0,
  });
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });


  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await getCart(user.token);
        setCartData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCart();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps - Design 13: Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === "shipping" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === "shipping" ? "border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "border-gray-300"
                }`}>
                1
              </div>
              <span className="hidden sm:inline font-semibold">Shipping</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === "payment" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === "payment" ? "border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "border-gray-300"
                }`}>
                2
              </div>
              <span className="hidden sm:inline font-semibold">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === "review" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === "review" ? "border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "border-gray-300"
                }`}>
                3
              </div>
              <span className="hidden sm:inline font-semibold">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Information - Design 14: Multi-step form */}
            {step === "shipping" && (
              <Card className="p-6 mb-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Shipping Information</h2>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="your first name"
                        value={address.firstName}
                        onChange={(e) =>
                          setAddress({ ...address, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="your last name"
                        value={address.lastName}
                        onChange={(e) =>
                          setAddress({ ...address, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@gmail.com"
                      value={address.email}
                      onChange={(e) =>
                        setAddress({ ...address, email: e.target.value })
                      } />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 **********"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      } />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="your address"
                      value={address.address}
                      onChange={(e) =>
                        setAddress({ ...address, address: e.target.value })
                      } />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="your city"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="your state"
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="your ZIP code"
                        value={address.zip}
                        onChange={(e) =>
                          setAddress({ ...address, zip: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Shipping Method</Label>
                    <RadioGroup value={shippingMethod}
                      onValueChange={async (value) => {
                        setShippingMethod(value);
                        try {
                          const { data } = await updateShippingMethod(value, user.token);
                          setCartData(data); // 🔥 updates totals from backend
                        } catch (err) {
                          console.log(err);
                        }
                      }}>
                      <Card className="p-4 mb-3 cursor-pointer hover:border-blue-600 transition-colors border border-blue-100">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-semibold">Standard Shipping</p>
                                <p className="text-sm text-gray-600">5-7 business days</p>
                              </div>
                              <p className="font-semibold text-green-600">FREE</p>
                            </div>
                          </Label>
                        </div>
                      </Card>
                      <Card className="p-4 cursor-pointer hover:border-blue-600 transition-colors border border-blue-100">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-semibold">Express Shipping</p>
                                <p className="text-sm text-gray-600">2-3 business days</p>
                              </div>
                              <p className="font-semibold">$15.00</p>
                            </div>
                          </Label>
                        </div>
                      </Card>
                    </RadioGroup>
                  </div>

                  <Button type="button" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={async () => {
                    try {
                      if (!address.firstName || !address.address || !address.city) {
                        alert("Please fill all required fields");
                        return;
                      }
                      await saveAddress(address, user.token);
                      setStep("payment");
                    } catch (err: any) {
                      console.log(err);
                      alert(err.response?.data?.message || "Failed to save address. Please try again.");
                    }
                  }}>
                    Continue to Payment
                  </Button>
                </form>
              </Card>
            )}

            {/* Payment Information */}
            {step === "payment" && (
              <Card className="p-6 mb-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Payment Information</h2>
                </div>

                <div className="mb-6">
                  <Label className="mb-3 block">Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={async (value) => {
                      setPaymentMethod(value);

                      try {
                        await savePaymentMethod(value, user.token);
                      } catch (err:any) {
                        console.log(err);
                        alert(err.response?.data?.message || "Failed to save payment method");
                      }
                    }}
                  >
                    <Card className="p-4 mb-3 cursor-pointer border border-blue-100">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          Cash on Delivery
                        </Label>
                      </div>
                    </Card>

                    {/* ONLINE */}
                    <Card hidden className="p-4 cursor-pointer border border-blue-100">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          UPI / Card / Net Banking
                        </Label>
                      </div>
                    </Card>
                  </RadioGroup>
                </div>

                <form className="space-y-6">
                  <div hidden>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div hidden className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" />
                    </div>
                  </div>

                  <div hidden>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>


                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setStep("shipping")}>
                      Back
                    </Button>
                    <Button type="button" size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={async () => {
                        try {
                          if (!paymentMethod) {
                            alert("Please select payment method");
                            return;
                          }
                          await savePaymentMethod(paymentMethod, user.token);
                          setStep("review");
                        } catch (err) {
                          console.log(err);
                        }
                      }}>
                      Review Order
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Order Review */}
            {step === "review" && (
              <div className="space-y-6">
                <Card className="p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold">Review Your Order</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-gray-600">
                        {address.firstName} {address.lastName}<br />
                        {address.address}<br />
                        {address.city}, {address.state} {address.zip}<br />
                        {address.email}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-gray-600 capitalize">
                        {paymentMethod}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Shipping Method</h3>
                      <p className="text-gray-600">
                        {shippingMethod === "standard"
                          ? "Standard Shipping (5-7 days) - FREE"
                          : "Express Shipping (2-3 days) - $15"}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Secure Checkout</p>
                      <p className="text-sm text-green-800">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" size="lg" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setStep("payment")}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={async () => {
                      try {
                        if (!paymentMethod) {
                          alert("Please select payment method");
                          return;
                        }
                        const { data } = await placeOrder(user.token);
                        navigate("/order-confirmation", {
                          state: { order: data },
                        });

                      } catch (err: any) {
                          console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response?.data);
                        alert(err || "Order failed");
                      }
                    }}
                  >
                    <Lock className="mr-2 w-5 h-5" />
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border border-blue-100">
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b">
                {cartData.items.map((item: any) => (
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cartData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">{cartData.shipping === 0 ? "FREE" : `$${cartData.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${cartData.tax.toFixed(2)}</span>
                </div>
              </div>

              {cartData.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ${cartData.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-xl mb-6">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${cartData.total.toFixed(2)}</span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div >
  );
}