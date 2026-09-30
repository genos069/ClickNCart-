import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { cartResponse, refreshPrices } from "../services/cartService.js";
import { fail, quantity, address, objectId } from "../utils/validation.js";
const find = (req) => Cart.findOne({ user: req.user._id });
async function required(req) {
  const cart = await find(req);
  if (!cart) fail("Cart not found", 404);
  return cart;
}
async function save(cart, res) {
  await refreshPrices(cart, undefined, false);
  await cart.save();
  res.json(cartResponse(cart));
}
export const getCart = async (req, res) => {
  const cart = await find(req);
  if (cart) await refreshPrices(cart, undefined, false);
  res.json(cartResponse(cart));
};
export const addToCart = async (req, res) => {
  const productId = objectId(req.body.productId);
  const count = quantity(req.body.quantity ?? 1);
  const product = await Product.findById(productId);
  if (!product) fail("Product not found", 404);
  if (!product.inStock) fail("Product out of stock", 409);
  const cart = (await find(req)) || new Cart({ user: req.user._id, items: [] });
  const item = cart.items.find((i) => i.productId === productId);
  if (item) item.quantity = quantity(item.quantity + count);
  else
    cart.items.push({
      productId,
      quantity: count,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  await save(cart, res);
};
export const removeFromCart = async (req, res) => {
  const cart = await find(req);
  if (!cart) return res.json(cartResponse(null));
  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  await save(cart, res);
};
export const clearCart = async (req, res) => {
  const cart = await find(req);
  if (cart) {
    cart.items = [];
    cart.discount = 0;
    cart.promoCode = undefined;
    await cart.save();
  }
  res.json(cartResponse(cart));
};
export const updateCartItem = async (req, res) => {
  const count = quantity(req.body.quantity, true);
  const cart = await required(req);
  const item = cart.items.find((i) => i.productId === req.body.productId);
  if (!item) fail("Item not found", 404);
  if (!count) cart.items = cart.items.filter((i) => i !== item);
  else item.quantity = count;
  await save(cart, res);
};
export const applyPromoCode = async (req, res) => {
  const code =
    typeof req.body.code === "string" ? req.body.code.trim().toUpperCase() : "";
  if (!["SAVE10", "SAVE20"].includes(code)) fail("Invalid promo code");
  const cart = await required(req);
  cart.discount = code === "SAVE10" ? 10 : 20;
  cart.promoCode = code;
  await save(cart, res);
};
export const updateShipping = async (req, res) => {
  if (!["standard", "express"].includes(req.body.method))
    fail("Invalid shipping method");
  const cart = await required(req);
  cart.shippingMethod = req.body.method;
  await save(cart, res);
};
export const saveShippingAddress = async (req, res) => {
  const value = address(req.body);
  const cart = await required(req);
  cart.shippingAddress = value;
  await save(cart, res);
};
