import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { refreshPrices, calculateCartTotals } from "../services/cartService.js";
import { address, fail, objectId } from "../utils/validation.js";
export const placeOrder = async (req, res) => {
  const key = req.get("Idempotency-Key");
  if (typeof key !== "string" || !/^[\w-]{16,100}$/.test(key))
    fail("A valid Idempotency-Key is required");
  const user = req.user._id;
  const existing = await Order.findOne({ user, checkoutKey: key });
  if (existing) return res.json({ order: existing });
  let order;
  await mongoose.connection.transaction(async (session) => {
    const prior = await Order.findOne({ user, checkoutKey: key }).session(
      session,
    );
    if (prior) {
      order = prior;
      return;
    }
    const cart = await Cart.findOne({ user }).session(session);
    if (!cart?.items.length) fail("Cart is empty", 409);
    if (
      !Number.isInteger(req.body.cartVersion) ||
      req.body.cartVersion !== cart.__v
    )
      fail("Cart changed. Reload checkout before placing your order", 409);
    const shippingAddress = address(cart.shippingAddress);
    if (
      cart.paymentMethod !== "cod" ||
      !["standard", "express"].includes(cart.shippingMethod)
    )
      fail("Select a valid shipping and payment method");
    await refreshPrices(cart, session);
    const totals = calculateCartTotals(cart);
    if (req.body.expectedTotal !== totals.total)
      fail("Prices changed. Reload checkout to review the new total", 409);
    [order] = await Order.create(
      [
        {
          user,
          checkoutKey: key,
          orderItems: cart.items.map((i) => i.toObject()),
          shippingAddress,
          paymentMethod: "cod",
          shippingMethod: cart.shippingMethod,
          ...totals,
          estimatedDelivery: new Date(
            Date.now() + (cart.shippingMethod === "express" ? 3 : 5) * 86400000,
          ),
        },
      ],
      { session },
    );
    cart.items = [];
    cart.discount = 0;
    cart.promoCode = undefined;
    await cart.save({ session });
  });
  res.status(201).json({ order });
};
export const getOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: objectId(req.params.id),
    user: req.user._id,
  });
  if (!order) fail("Order not found", 404);
  res.json({ order });
};
