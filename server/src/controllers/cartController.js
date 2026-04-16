import Cart from "../models/Cart.js";

// GET CART
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.json({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      discountAmount: 0,
      total: 0,
    });
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
};

// ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, name, price, image } = req.body;

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
      image,
    });
  }

  await cart.save();

  const totals = calculateCartTotals(cart);

  res.json({
    items: cart.items,
    ...totals,
  });
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter((item) => item.productId !== productId);

  await cart.save();

  const totals = calculateCartTotals(cart);

  res.json({
    items: cart.items,
    ...totals,
  });
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

  let discount = 0;

  if (code === "SAVE10") {
    discount = 10; // 10%
  } else if (code === "SAVE20") {
    discount = 20;
  } else {
    return res.status(400).json({ message: "Invalid promo code ❌" });
  }

  cart.discount = discount;
  cart.promoCode = code;

  await cart.save();

  const totals = calculateCartTotals(cart);

  res.json({
    items: cart.items,
    promoCode: cart.promoCode,
    ...totals,
  });
};


//Calculate Cart Total
const calculateCartTotals = (cart) => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;

  const discountAmount = (subtotal * cart.discount) / 100;

  const total = subtotal + shipping + tax - discountAmount;

  return {
    subtotal,
    shipping,
    tax,
    discount: cart.discount,
    discountAmount,
    total,
  };
};


// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find((i) => i.productId === productId);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (quantity <= 0) {
    // remove item
    cart.items = cart.items.filter((i) => i.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  // ✅ Recalculate totals here (IMPORTANT)
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
};