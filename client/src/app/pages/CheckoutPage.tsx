import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Lock, CreditCard, Truck, Package, CheckCircle2 } from "lucide-react";

export function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = 956;
  const shipping = 0;
  const tax = 76.48;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps - Design 13: Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === "shipping" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step === "shipping" ? "border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "border-gray-300"
              }`}>
                1
              </div>
              <span className="hidden sm:inline font-semibold">Shipping</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === "payment" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step === "payment" ? "border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "border-gray-300"
              }`}>
                2
              </div>
              <span className="hidden sm:inline font-semibold">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === "review" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step === "review" ? "border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "border-gray-300"
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
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Main Street" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Shipping Method</Label>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
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

                  <Button type="button" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setStep("payment")}>
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
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <Card className="p-4 mb-3 cursor-pointer hover:border-blue-600 transition-colors border border-blue-100">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5" />
                            <span className="font-semibold">Credit / Debit Card</span>
                          </div>
                        </Label>
                      </div>
                    </Card>
                  </RadioGroup>
                </div>

                <form className="space-y-6">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="billing" />
                    <Label htmlFor="billing" className="text-sm cursor-pointer">
                      Billing address same as shipping
                    </Label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setStep("shipping")}>
                      Back
                    </Button>
                    <Button type="button" size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setStep("review")}>
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
                        John Doe<br />
                        123 Main Street<br />
                        New York, NY 10001<br />
                        john@example.com
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-gray-600">Credit Card ending in 3456</p>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Shipping Method</h3>
                      <p className="text-gray-600">Standard Shipping (5-7 business days) - FREE</p>
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
                  <Button type="button" size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?w=100"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Premium Wireless Headphones</p>
                    <p className="text-sm text-gray-600">Qty: 1</p>
                    <p className="text-sm font-semibold">$299</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1523394373826-0b47f5d8d30f?w=100"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Smart Watch Pro</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                    <p className="text-sm font-semibold">$798</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl mb-6">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
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
    </div>
  );
}