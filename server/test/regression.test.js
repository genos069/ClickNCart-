import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { calculateCartTotals } from "../src/services/cartService.js";
import { quantity, address, password } from "../src/utils/validation.js";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Brand from "../src/models/Brand.js";
import Cart from "../src/models/Cart.js";
import Order from "../src/models/Order.js";
import Review from "../src/models/Review.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
process.env.JWT_SECRET = "test-only-secret-not-for-deployment-123456789";
const { app } = await import("../src/app.js");
let db, server, base, token, user, product, brand;
async function request(path, method = "GET", body, auth = token, extra = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...extra,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}
const shippingAddress = {
  firstName: "Test",
  lastName: "Buyer",
  email: "buyer@example.test",
  phone: "+91 9876543210",
  address: "42 Test Street",
  city: "Test City",
  state: "Odisha",
  zip: "761020",
};
before(async () => {
  db = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(db.getUri());
  await Promise.all([
    User.init(),
    Brand.init(),
    Cart.init(),
    Order.init(),
    Product.init(),
    Review.init(),
  ]);
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
  const registered = await request(
    "/auth/register",
    "POST",
    {
      name: "Test Buyer",
      email: "Buyer@Example.test",
      password: "ValidPassword123",
    },
    null,
  );
  assert.equal(registered.status, 201);
  token = registered.body.token;
  user = registered.body._id;
  brand = await Brand.create({ name: "Example" });
  product = await Product.create({
    name: "Test Camera [Pro]",
    brand: brand._id,
    price: 200,
    originalPrice: 250,
    discount: 20,
    category: "Cameras",
    description: "Test",
    image: "/test.svg",
  });
});
after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (db) await db.stop();
});
test("quote arithmetic, saved express shipping, empty carts, invalid input", () => {
  assert.equal(calculateCartTotals({ items: [], discount: 0 }).total, 0);
  assert.equal(
    calculateCartTotals({
      items: [{ price: 200, quantity: 1 }],
      shippingMethod: "express",
      discount: 10,
    }).total,
    211,
  );
  for (const value of [undefined, 0.5, -1, NaN, Infinity, 100, "2"])
    assert.throws(() => quantity(value));
  assert.throws(() => address({}));
  assert.throws(() => password("x"));
  assert.throws(() => calculateCartTotals({ items: [], discount: 200 }));
});
test("catalog mutations require administrator", async () => {
  for (const [path, method] of [
    ["/product/create", "POST"],
    ["/product/seed", "POST"],
    [`/product/edit/${product._id}`, "POST"],
    ["/brand", "POST"],
    ["/brand/seed", "POST"],
    [`/brand/${brand._id}`, "PUT"],
    [`/brand/${brand._id}`, "DELETE"],
    ["/review/check", "POST"],
  ]) {
    assert.equal((await request(path, method, {}, null)).status, 401);
    assert.equal((await request(path, method, {})).status, 403);
  }
});
test("email normalization, malformed/expired/deleted-user sessions", async () => {
  assert.equal(
    (
      await request(
        "/auth/login",
        "POST",
        { email: " BUYER@Example.test ", password: "ValidPassword123" },
        null,
      )
    ).status,
    200,
  );
  for (const bad of [
    "invalid",
    jwt.sign({ id: user, version: 0 }, process.env.JWT_SECRET, {
      expiresIn: -1,
    }),
    jwt.sign(
      { id: new mongoose.Types.ObjectId(), version: 0 },
      process.env.JWT_SECRET,
    ),
  ])
    assert.equal((await request("/cart", "GET", undefined, bad)).status, 401);
});
test("missing cart deletion is safe; catalog controls price and quantities", async () => {
  assert.equal((await request(`/cart/${product._id}`, "DELETE")).body.total, 0);
  assert.equal(
    (
      await request("/cart", "POST", {
        productId: new mongoose.Types.ObjectId().toString(),
        price: -50,
      })
    ).status,
    404,
  );
  const response = await request("/cart", "POST", {
    productId: String(product._id),
    quantity: 3,
    price: -50,
    name: "Fake",
  });
  assert.equal(response.body.subtotal, 600);
  assert.equal(response.body.items[0].name, product.name);
  assert.equal(response.body.items[0].quantity, 3);
  for (const quantity of [0.5, -1, 100, "1", null])
    assert.equal(
      (
        await request("/cart/update", "PATCH", {
          productId: String(product._id),
          quantity,
        })
      ).status,
      400,
    );
  assert.equal(
    (await request("/cart/update", "PATCH", { productId: String(product._id) }))
      .status,
    400,
  );
});
test("shipping/payment enums, address checks, coupon precedence and AI fallback", async () => {
  assert.equal((await request("/cart/address", "PUT", {})).status, 400);
  assert.equal(
    (await request("/cart/shipping", "PUT", { method: "teleport" })).status,
    400,
  );
  assert.equal(
    (await request("/payment", "POST", { paymentMethod: "online" })).status,
    400,
  );
  await request("/cart/shipping", "PUT", { method: "express" });
  assert.equal((await request("/cart")).body.shipping, 15);
  await request("/cart/promo", "POST", { code: "SAVE20" });
  const ai = await request("/cart/apply-ai-discount", "POST", {});
  assert.equal(ai.body.discount, 20);
  assert.equal(ai.body.discountSource, "coupon");
});
test("checkout rejects incomplete state, uses trusted totals and is atomic/idempotent", async () => {
  let cart = (await request("/cart")).body;
  const key = "checkout-regression-key-001";
  assert.equal(
    (
      await request(
        "/orders",
        "POST",
        { cartVersion: cart.version, expectedTotal: cart.total },
        token,
        { "Idempotency-Key": key },
      )
    ).status,
    400,
  );
  await request("/cart/address", "PUT", shippingAddress);
  await request("/payment", "POST", { paymentMethod: "cod" });
  cart = (await request("/cart")).body;
  assert.equal(
    (
      await request(
        "/orders",
        "POST",
        { cartVersion: cart.version, expectedTotal: 1 },
        token,
        { "Idempotency-Key": key },
      )
    ).status,
    409,
  );
  const payload = { cartVersion: cart.version, expectedTotal: cart.total };
  const responses = await Promise.all([
    request("/orders", "POST", payload, token, { "Idempotency-Key": key }),
    request("/orders", "POST", payload, token, { "Idempotency-Key": key }),
    request("/orders", "POST", payload, token, {
      "Idempotency-Key": "different-concurrent-key",
    }),
  ]);
  assert.equal(await Order.countDocuments({ user }), 1);
  const stored = await Order.findOne({ user });
  assert.equal(stored.total, cart.total);
  assert.equal(stored.shipping, 15);
  assert.ok(stored.estimatedDelivery);
  assert.equal((await request("/cart")).body.items.length, 0);
  const replay = await request("/orders", "POST", payload, token, {
    "Idempotency-Key": stored.checkoutKey,
  });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.order._id, String(stored._id));
  assert.ok(responses.some((r) => r.status === 201));
  const other = await User.create({
    name: "Other",
    email: "other@example.test",
    password: "hash",
  });
  const otherToken = jwt.sign(
    { id: other._id, version: 0 },
    process.env.JWT_SECRET,
  );
  assert.equal(
    (await request(`/orders/${stored._id}`, "GET", undefined, otherToken))
      .status,
    404,
  );
});
test("literal search, bounded pagination and trimmed categories", async () => {
  const literal = await request("/product/list?search=%5B");
  assert.equal(literal.status, 200);
  assert.equal(literal.body.total, 1);
  for (const query of [
    "limit=0",
    "limit=1000",
    "page=-1",
    "page=1.5",
    "minPrice=no",
    "inStock=maybe",
    "brand=bad",
  ])
    assert.equal((await request(`/product/list?${query}`)).status, 400);
  for (const category of [
    "Smart Home",
    "Storage",
    "TVs",
    "Tablets",
    "Tech",
    "Transport",
  ]) {
    const p = new Product({
      name: "x",
      brand: brand._id,
      category,
      price: 1,
      description: "x",
      image: "x",
    });
    assert.equal(p.validateSync(), undefined);
  }
  const expensive = await Product.create({
    name: "Expensive",
    brand: brand._id,
    category: "Cameras",
    price: 5000,
    description: "x",
    image: "x",
  });
  assert.equal(
    (await request("/product/list?minPrice=4000")).body.data[0]._id,
    String(expensive._id),
  );
});
test("reviews check product existence, hide email, update aggregates and verify delivered purchase", async () => {
  const body = { rating: 5, title: "Useful", comment: "A good product" };
  assert.equal(
    (
      await request(
        `/review/create/${new mongoose.Types.ObjectId()}`,
        "POST",
        body,
      )
    ).status,
    404,
  );
  assert.equal(
    (await request(`/review/create/${product._id}`, "POST", body)).status,
    201,
  );
  let publicReviews = await request(
    `/review/product/get/${product._id}`,
    "GET",
    undefined,
    null,
  );
  assert.equal(publicReviews.body.data[0].user.email, undefined);
  assert.equal(publicReviews.body.data[0].verifiedPurchase, false);
  assert.equal((await Product.findById(product._id)).reviews, 1);
  await Review.deleteMany({ product: product._id });
  await Order.updateOne({ user }, { isDelivered: true });
  const verified = await request(`/review/create/${product._id}`, "POST", body);
  assert.equal(verified.body.review.verifiedPurchase, true);
  assert.ok(verified.body.review.purchasedAt);
  assert.equal(
    (await request(`/review/create/${product._id}`, "POST", body)).status,
    409,
  );
});
test("reset password consumes token once and invalidates old sessions", async () => {
  const raw = "a".repeat(64),
    hashed = crypto.createHash("sha256").update(raw).digest("hex");
  await User.updateOne(
    { _id: user },
    {
      resetPasswordToken: hashed,
      resetPasswordExpire: new Date(Date.now() + 60000),
    },
  );
  assert.equal(
    (
      await request(
        `/auth/reset-password/${raw}`,
        "PUT",
        { password: "x" },
        null,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        `/auth/reset-password/${raw}`,
        "PUT",
        { password: "NewPassword123" },
        null,
      )
    ).status,
    200,
  );
  assert.equal((await request("/cart")).status, 401);
  assert.equal(
    (
      await request(
        `/auth/reset-password/${raw}`,
        "PUT",
        { password: "NewPassword123" },
        null,
      )
    ).status,
    400,
  );
});
