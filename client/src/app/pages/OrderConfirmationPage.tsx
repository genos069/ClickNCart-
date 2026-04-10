import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle, Package, Truck, MapPin, Calendar, CreditCard, Download, Mail } from "lucide-react";

export function OrderConfirmationPage() {
  const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const orderDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. We've sent a confirmation email to your inbox.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="p-6 mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-green-700">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold">{orderDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-blue-600">{estimatedDelivery}</p>
            </div>
          </div>
        </Card>

        {/* Order Timeline */}
        <Card className="p-6 mb-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Order Status
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-500 via-blue-300 to-gray-300"></div>

            {/* Timeline items */}
            <div className="space-y-8">
              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0 z-10">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-green-700">Order Confirmed</p>
                  <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white flex-shrink-0 z-10">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-blue-700">Processing</p>
                  <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                  <p className="text-xs text-gray-500 mt-1">Expected: Within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0 z-10">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Shipped</p>
                  <p className="text-sm text-gray-500">Your order will be on its way soon</p>
                  <p className="text-xs text-gray-400 mt-1">Expected: 1-2 business days</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0 z-10">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Delivered</p>
                  <p className="text-sm text-gray-500">Package arrives at your doorstep</p>
                  <p className="text-xs text-gray-400 mt-1">Expected: {estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Details */}
        <Card className="p-6 mb-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Shipping Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold mb-3 text-blue-900">Delivery Address</h3>
              <p className="text-gray-700">John Doe</p>
              <p className="text-gray-600 text-sm">123 Main Street</p>
              <p className="text-gray-600 text-sm">Apartment 4B</p>
              <p className="text-gray-600 text-sm">New York, NY 10001</p>
              <p className="text-gray-600 text-sm">United States</p>
              <p className="text-gray-600 text-sm mt-2">Phone: (555) 123-4567</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <h3 className="font-semibold mb-3 text-purple-900">Billing Address</h3>
              <p className="text-gray-700">John Doe</p>
              <p className="text-gray-600 text-sm">123 Main Street</p>
              <p className="text-gray-600 text-sm">Apartment 4B</p>
              <p className="text-gray-600 text-sm">New York, NY 10001</p>
              <p className="text-gray-600 text-sm">United States</p>
              <Badge className="mt-2 bg-green-100 text-green-700 border-0">Same as shipping</Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Shipping Method</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Standard Shipping</p>
                <p className="text-sm text-gray-600">Estimated delivery: 5-7 business days</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 text-base px-3 py-1">FREE</Badge>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6 mb-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex-shrink-0 border border-blue-100"></div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Product Name {i + 1}</h3>
                  <p className="text-sm text-gray-600 mb-2">Quantity: 1</p>
                  <p className="text-lg font-semibold text-blue-600">${(299.99 * (i + 1)).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment & Total */}
        <Card className="p-6 mb-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Payment Summary</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">$899.97</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">$72.00</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-blue-200">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                $971.97
              </span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700 mb-1">Payment Method</p>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Visa ending in 4242</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Download className="mr-2 w-4 h-4" />
            Download Invoice
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Mail className="mr-2 w-4 h-4" />
            Email Receipt
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Truck className="mr-2 w-4 h-4" />
            Track Order
          </Button>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link to="/shop">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <Card className="mt-8 p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="font-semibold mb-3 text-center">Need Help?</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            If you have any questions about your order, our customer service team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Contact Support
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View FAQs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
