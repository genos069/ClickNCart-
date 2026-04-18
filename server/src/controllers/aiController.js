import axios from "axios";
import Cart from "../models/Cart.js";

export const applyAIDiscount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 🧠 Call LOCAL Python API
    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      {
        subtotal,
        totalItems: cart.items.length,
      }
    );

    const aiDiscount = aiResponse.data.discount;

    cart.discount = aiDiscount;
    await cart.save();

    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const discountAmount = (subtotal * cart.discount) / 100;
    const total = subtotal + shipping + tax - discountAmount;

    res.json({
      items: cart.items,
      subtotal,
      shipping,
      tax,
      discount: cart.discount,
      discountAmount,
      total,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "AI failed" });
  }
};