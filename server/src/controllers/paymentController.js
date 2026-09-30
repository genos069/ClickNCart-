import Cart from "../models/Cart.js";
import { fail } from "../utils/validation.js";
import { cartResponse } from "../services/cartService.js";
export const savePaymentMethod = async (req, res) => {
  if (req.body.paymentMethod !== "cod")
    fail("Only cash on delivery is supported");
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) fail("Cart not found", 404);
  cart.paymentMethod = "cod";
  await cart.save();
  res.json(cartResponse(cart));
};
