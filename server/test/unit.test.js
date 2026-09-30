import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import {
  calculateCartTotals,
  cartResponse,
} from "../src/services/cartService.js";
import { quantity, address, password, email } from "../src/utils/validation.js";
import { protect, admin } from "../src/middleware/authMiddleware.js";
import {
  getProducts,
  seedProduct,
} from "../src/controllers/productController.js";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../src/controllers/cartController.js";
import { applyAIDiscount } from "../src/controllers/aiController.js";
import { getProductReviews } from "../src/controllers/reviewControllers.js";
import Product from "../src/models/Product.js";
import Cart from "../src/models/Cart.js";
import Brand from "../src/models/Brand.js";
import User from "../src/models/User.js";
import Order from "../src/models/Order.js";
import Review from "../src/models/Review.js";
import axios from "axios";
import jwt from "jsonwebtoken";
const id = "507f1f77bcf86cd799439011";
const response = () => ({
  code: 200,
  body: null,
  status(n) {
    this.code = n;
    return this;
  },
  json(v) {
    this.body = v;
    return this;
  },
});
afterEach(() => mock.restoreAll());
test("empty carts have zero fees and totals", () =>
  assert.equal(cartResponse(null).total, 0));
test("express shipping and coupon use a consistent quote", () => {
  const cart = {
    items: [{ price: 200, quantity: 3 }],
    shippingMethod: "express",
    discount: 20,
  };
  assert.deepEqual(calculateCartTotals(cart), {
    subtotal: 600,
    shipping: 15,
    tax: 48,
    discount: 20,
    discountAmount: 120,
    total: 543,
  });
});
test("money rounds to cents and rejects invalid prices/discounts", () => {
  assert.equal(
    calculateCartTotals({ items: [{ price: 0.1, quantity: 3 }], discount: 0 })
      .subtotal,
    0.3,
  );
  for (const price of [-1, NaN, Infinity])
    assert.throws(() =>
      calculateCartTotals({ items: [{ price, quantity: 1 }] }),
    );
  for (const discount of [51, -1, Infinity])
    assert.throws(() => calculateCartTotals({ items: [], discount }));
});
test("quantity, email, address and password validation", () => {
  for (const n of [undefined, 0.5, -1, 100, "1", NaN, null])
    assert.throws(() => quantity(n));
  assert.equal(quantity(0, true), 0);
  assert.equal(email(" TEST@Example.test "), "test@example.test");
  assert.throws(() => email({ $ne: null }));
  assert.throws(() => address({}));
  for (const p of ["x", "a".repeat(73), {}, null])
    assert.throws(() => password(p));
});
test("catalog schema accepts normal category names and rejects negative prices", () => {
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
      brand: id,
      category,
      price: 1,
      description: "x",
      image: "x",
    });
    assert.equal(p.validateSync(), undefined);
  }
  assert.ok(new Product({ price: -1 }).validateSync());
});
test("missing and malformed sessions return 401", async () => {
  for (const authorization of [undefined, "Bearer broken"]) {
    const res = response();
    await protect({ headers: { authorization } }, res, () => assert.fail());
    assert.equal(res.code, 401);
  }
});
test("reset token version and deleted users invalidate sessions", async () => {
  process.env.JWT_SECRET = "unit-test-only-secret-not-for-production";
  const token = jwt.sign({ id, version: 0 }, process.env.JWT_SECRET);
  for (const user of [null, { _id: id, tokenVersion: 1 }]) {
    mock.method(User, "findById", () => ({ select: async () => user }));
    const res = response();
    await protect({ headers: { authorization: `Bearer ${token}` } }, res, () =>
      assert.fail(),
    );
    assert.equal(res.code, 401);
    mock.restoreAll();
  }
});
test("customer cannot administer the catalog", () => {
  const res = response();
  admin({ user: { role: "customer" } }, res, () => assert.fail());
  assert.equal(res.code, 403);
});
test("cart uses loaded catalog identity and selected quantity", async () => {
  mock.method(Product, "findById", async () => ({
    _id: id,
    name: "Trusted",
    price: 200,
    image: "trusted",
    inStock: true,
  }));
  mock.method(Cart, "findOne", async () => null);
  mock.method(Cart.prototype, "save", async function () {
    return this;
  });
  const res = response();
  await addToCart(
    {
      user: { _id: id },
      body: { productId: id, quantity: 3, name: "Fake", price: -50 },
    },
    res,
  );
  assert.equal(res.body.subtotal, 600);
  assert.equal(res.body.items[0].name, "Trusted");
  assert.equal(res.body.items[0].quantity, 3);
});
test("missing product and bad quantities reject before persistence", async () => {
  mock.method(Product, "findById", async () => null);
  await assert.rejects(
    addToCart({ user: { _id: id }, body: { productId: id } }, response()),
    { status: 404 },
  );
  await assert.rejects(
    updateCartItem({ body: { quantity: 0.5 } }, response()),
    { status: 400 },
  );
});
test("removing from a missing cart returns an empty quote", async () => {
  mock.method(Cart, "findOne", async () => null);
  const res = response();
  await removeFromCart({ user: { _id: id }, params: { productId: id } }, res);
  assert.equal(res.body.total, 0);
});
test("pagination and filters reject invalid values", async () => {
  for (const query of [
    { limit: "0" },
    { page: "1.5" },
    { search: {} },
    { maxPrice: "NaN" },
    { inStock: "maybe" },
    { brand: "bad" },
  ])
    await assert.rejects(getProducts({ query }, response()), { status: 400 });
});
test("search escapes regex metacharacters and sets bounded pagination", async () => {
  let filter, limit, skip;
  mock.method(Product, "find", (q) => {
    filter = q;
    return {
      sort() {
        return this;
      },
      skip(n) {
        skip = n;
        return this;
      },
      limit(n) {
        limit = n;
        return Promise.resolve([]);
      },
    };
  });
  mock.method(Product, "countDocuments", async () => 0);
  await getProducts(
    { query: { search: "[", page: "2", limit: "24" } },
    response(),
  );
  assert.equal(filter.$or[0].name.$regex, "\\[");
  assert.equal(limit, 24);
  assert.equal(skip, 24);
});
test("AI invalid response preserves discount; first-time purchase history is correct", async () => {
  process.env.AI_DISCOUNT_URL = "https://example.test/discount";
  process.env.AI_API_KEY = "test";
  const cart = {
    items: [{ productId: id, price: 200, quantity: 1 }],
    discount: 10,
    shippingMethod: "standard",
    save: async () => assert.fail("Invalid discount saved"),
  };
  mock.method(Cart, "findOne", async () => cart);
  mock.method(Product, "findById", async () => ({
    name: "x",
    price: 200,
    inStock: true,
  }));
  mock.method(Order, "aggregate", async () => []);
  let payload;
  mock.method(axios, "post", async (url, data, config) => {
    payload = data;
    assert.equal(config.timeout, 4000);
    return { data: { final_discount_pct: 200 } };
  });
  const res = response();
  await applyAIDiscount({ user: { _id: id }, body: {} }, res);
  assert.equal(payload.is_new, true);
  assert.equal(payload.num_purchases, 0);
  assert.equal(res.body.discount, 10);
});
test("explicit coupon is not overwritten by AI", async () => {
  const cart = {
    items: [{ price: 200, quantity: 1 }],
    promoCode: "SAVE20",
    discount: 20,
  };
  mock.method(Cart, "findOne", async () => cart);
  mock.method(axios, "post", async () => assert.fail());
  const res = response();
  await applyAIDiscount({ user: { _id: id } }, res);
  assert.equal(res.body.discountSource, "coupon");
});
test("public reviews project display name only", async () => {
  let projection;
  mock.method(Review, "find", () => ({
    populate(field, fields) {
      projection = fields;
      return this;
    },
    sort() {
      return this;
    },
    skip() {
      return this;
    },
    limit: async () => [],
  }));
  mock.method(Review, "countDocuments", async () => 0);
  await getProductReviews({ params: { productId: id }, query: {} }, response());
  assert.equal(projection, "name");
});
test("imports normalize brands, clamp discounts and report rejected rows", async () => {
  let options, saved;
  mock.method(Brand, "findOneAndUpdate", async (q, update, opts) => {
    options = opts;
    return { _id: id };
  });
  mock.method(Product.prototype, "save", async function () {
    saved = this;
    await this.validate();
    return this;
  });
  const res = response();
  await seedProduct(
    {
      body: [
        {
          name: "x",
          brand: " apple ",
          price: 10,
          originalPrice: 5,
          image: "x",
          category: "Cameras",
          description: "x",
        },
        { brand: "apple", price: -10 },
      ],
    },
    res,
  );
  assert.equal(options.collation.strength, 2);
  assert.equal(res.body.data[0].discount, 0);
  assert.equal(res.body.errors.length, 1);
  assert.equal(res.code, 207);
});
