import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Cart from "../src/models/Cart.js";
import Brand from "../src/models/Brand.js";
import Product from "../src/models/Product.js";
import Order from "../src/models/Order.js";
import Review from "../src/models/Review.js";
if (!process.env.MONGO_URI) throw new Error("MONGO_URI required");
await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });
try {
  // Preflight first: never silently discard duplicate customer/cart records.
  const duplicateCarts = await Cart.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  const duplicateEmails = await User.aggregate([
    {
      $group: {
        _id: { $toLower: { $trim: { input: "$email" } } },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]);
  if (duplicateCarts.length || duplicateEmails.length)
    throw new Error(
      "Resolve duplicate carts/users from a backup before migration; no changes made",
    );
  await mongoose.connection.transaction(async (session) => {
    await User.collection.updateMany(
      {},
      [
        {
          $set: {
            email: { $toLower: { $trim: { input: "$email" } } },
            role: { $ifNull: ["$role", "customer"] },
            tokenVersion: { $ifNull: ["$tokenVersion", 0] },
          },
        },
      ],
      { session },
    );
    await Product.collection.updateMany(
      {},
      [{ $set: { category: { $trim: { input: "$category" } } } }],
      { session },
    );
    // Retain one brand, move its product references before removing duplicate names.
    const brands = await Brand.find().sort({ _id: 1 }).session(session);
    const seen = new Map();
    for (const brand of brands) {
      const key = brand.name.trim().toLowerCase();
      if (seen.has(key)) {
        await Product.updateMany(
          { brand: brand._id },
          { brand: seen.get(key) },
          { session },
        );
        await Brand.deleteOne({ _id: brand._id }, { session });
      } else {
        seen.set(key, brand._id);
        await Brand.updateOne(
          { _id: brand._id },
          { name: brand.name.trim() },
          { session },
        );
      }
    }
    // Old carts contain untrusted snapshots. Users must rebuild them from catalog data.
    await Cart.updateMany(
      { schemaVersion: { $ne: 2 } },
      {
        $set: {
          items: [],
          discount: 0,
          shippingMethod: "standard",
          paymentMethod: "cod",
          schemaVersion: 2,
        },
        $unset: { promoCode: 1 },
        $inc: { __v: 1 },
      },
      { session },
    );
  });
  // Replace only the legacy brand-name index; retain unrelated indexes.
  const indexes = await Brand.collection.indexes();
  const old = indexes.find((i) => i.key.name === 1 && !i.collation);
  if (old) await Brand.collection.dropIndex(old.name);
  for (const model of [User, Cart, Brand, Product, Order, Review])
    await model.createIndexes();
  for await (const p of Product.find().cursor()) {
    const stats = await Review.aggregate([
      { $match: { product: p._id } },
      {
        $group: { _id: null, count: { $sum: 1 }, rating: { $avg: "$rating" } },
      },
    ]);
    await Product.updateOne(
      { _id: p._id },
      {
        reviews: stats[0]?.count || 0,
        rating: Number((stats[0]?.rating || 0).toFixed(1)),
        discount:
          p.originalPrice > p.price
            ? Math.round(
                ((p.originalPrice - p.price) / p.originalPrice) * 10000,
              ) / 100
            : 0,
      },
    );
  }
  console.log(
    "Migration complete. Historical orders are retained without inventing missing amounts.",
  );
} finally {
  await mongoose.disconnect();
}
