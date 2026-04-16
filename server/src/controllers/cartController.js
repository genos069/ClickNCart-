import Cart from "../models/Cart.js";

// GET CART
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json(cart || { items: [] });
};

// ADD TO CART
export const addToCart = async (req, res) => {
  const { productId , name , price , image} = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
    });
  }

  const exist = cart.items.find((item) => item.productId === productId);

  if (exist) {
    exist.quantity += 1;
  } else {
    cart.items.push({ 
      productId,
      name,
      price,
      quantity: 1,
      image
     });
  }

  await cart.save();
  res.json(cart);
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter((item) => item.productId !== productId);

  await cart.save();

  res.json(cart);
};

// CLEAR CART
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json({ message: "Cart cleared" });
};


// PROMOCODE LOGIC
export const applyPromoCode = async (req, res) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // promo logic
  let discount = 0;

  if (code === "SAVE10") {
    discount = 10; // flat discount
  } else if (code === "SAVE20") {
    discount = 20;
  } else {
    return res.status(400).json({ message: "Invalid promo code ❌" });
  }

  cart.discount = discount;
  cart.promoCode = code;

  await cart.save();

  res.json(cart);
};