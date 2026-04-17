import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ❗ ensure required data exists
    if (!cart.shippingAddress) {
      return res.status(400).json({ message: "Shipping address missing" });
    }

    if (!cart.paymentMethod) {
      return res.status(400).json({ message: "Payment method missing" });
    }

    if (!cart.shippingMethod) {
      return res.status(400).json({ message: "Shipping method missing" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: cart.items,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      shippingMethod: cart.shippingMethod,

      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      discount: cart.discount,
      discountAmount: cart.discountAmount,
      total: cart.total,
    });

    const createdOrder = await order.save();

    // 🧹 Clear cart after order
    cart.items = [];
    cart.subtotal = 0;
    cart.shipping = 0;
    cart.tax = 0;
    cart.discount = 0;
    cart.discountAmount = 0;
    cart.total = 0;

    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};