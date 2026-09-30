import Product from "../models/Product.js";
import { fail, quantity } from "../utils/validation.js";
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
export function calculateCartTotals(cart) {
  const items = cart?.items || [];
  const subtotal = round(
    items.reduce((sum, item) => {
      quantity(item.quantity);
      if (!Number.isFinite(item.price) || item.price < 0)
        fail("Invalid product price");
      return sum + round(item.price * item.quantity);
    }, 0),
  );
  const discount = cart?.discount ?? 0;
  if (!Number.isFinite(discount) || discount < 0 || discount > 50)
    fail("Invalid discount");
  const shipping = !items.length
    ? 0
    : cart.shippingMethod === "express"
      ? 15
      : subtotal > 100
        ? 0
        : 15;
  const tax = round(subtotal * 0.08);
  const discountAmount = round((subtotal * discount) / 100);
  return {
    subtotal,
    shipping,
    tax,
    discount,
    discountAmount,
    total: round(subtotal + shipping + tax - discountAmount),
  };
}
export function cartResponse(cart) {
  return {
    items: cart?.items || [],
    ...calculateCartTotals(cart),
    shippingMethod: cart?.shippingMethod || "standard",
    shippingAddress: cart?.shippingAddress,
    paymentMethod: cart?.paymentMethod,
    promoCode: cart?.promoCode || "",
    discountSource: cart?.promoCode ? "coupon" : cart?.discount ? "ai" : "none",
    version: cart?.__v ?? 0,
  };
}
export async function refreshPrices(cart, session, strict = true) {
  for (const item of cart.items) {
    const query = Product.findById(item.productId);
    if (session) query.session(session);
    const product = await query;
    if (!product || !product.inStock) {
      if (strict)
        fail("A product is unavailable; remove it from your cart", 409);
      if (!product) continue;
    }
    item.name = product.name;
    item.price = product.price;
    item.image = product.image;
  }
  return cart;
}
