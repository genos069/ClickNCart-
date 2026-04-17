import Cart from "../models/Cart.js";

export const savePaymentMethod = async (req, res) => {
  const { paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.paymentMethod = paymentMethod;
  await cart.save();

  res.json(cart);
};
