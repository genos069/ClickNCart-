import axios from "axios";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { cartResponse, refreshPrices } from "../services/cartService.js";
export const applyAIDiscount = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (
    !cart?.items.length ||
    cart.promoCode ||
    !process.env.AI_DISCOUNT_URL ||
    !process.env.AI_API_KEY
  )
    return res.json(cartResponse(cart));
  await refreshPrices(cart);
  const history = await Order.aggregate([
    { $match: { user: req.user._id, isDelivered: true } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        spend: { $sum: "$total" },
        last: { $max: "$createdAt" },
      },
    },
  ]);
  const stats = history[0];
  try {
    const { data } = await axios.post(
      process.env.AI_DISCOUNT_URL,
      {
        user_id: String(req.user._id),
        time_on_page: 60,
        items_in_cart: cart.items.length,
        cart_value: cartResponse(cart).subtotal,
        is_new: !stats?.count,
        num_purchases: stats?.count || 0,
        past_total_spend: stats?.spend || 0,
        days_since_last: stats?.last
          ? Math.floor((Date.now() - stats.last.getTime()) / 86400000)
          : 0,
      },
      {
        timeout: 4000,
        maxRedirects: 0,
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );
    const discount = data.final_discount_pct;
    if (
      typeof discount === "number" &&
      Number.isFinite(discount) &&
      discount >= 0 &&
      discount <= 50
    ) {
      cart.discount = discount;
      await cart.save();
    }
  } catch {
    /* Optional recommendation must never block the cart. */
  }
  const latest = await Cart.findOne({ user: req.user._id });
  res.json(cartResponse(latest));
};
