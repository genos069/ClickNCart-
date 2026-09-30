import axios from "axios";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { updateProductRating } from "./productController.js";
import { fail, objectId, text } from "../utils/validation.js";
export const createReview = async (req, res) => {
  const product = objectId(req.params.productId),
    user = req.user._id;
  if (!(await Product.exists({ _id: product }))) fail("Product not found", 404);
  const rating = req.body.rating;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    fail("Rating must be an integer from 1 to 5");
  const title = text(req.body.title, "title", 120),
    comment = text(req.body.comment, "comment", 4000);
  const order = await Order.findOne({
    user,
    "orderItems.productId": product,
    isDelivered: true,
  }).sort({ createdAt: -1 });
  const review = await Review.create({
    product,
    user,
    rating,
    title,
    comment,
    verifiedPurchase: !!order,
    purchasedAt: order?.createdAt,
  });
  await updateProductRating(product);
  res.status(201).json({ success: true, review });
};
export const getProductReviews = async (req, res) => {
  const product = objectId(req.params.productId);
  const page = Number(req.query.page || 1);
  if (!Number.isInteger(page) || page < 1 || page > 10000) fail("Invalid page");
  const data = await Review.find({ product })
    .populate("user", "name")
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * 20)
    .limit(20);
  const count = await Review.countDocuments({ product });
  res.json({ success: true, count, page, pages: Math.ceil(count / 20), data });
};
// Admin-requested, bounded moderation batch; never part of review submission.
export const submitReview = async (req, res) => {
  if (!process.env.REVIEW_ML_URL)
    fail("Review moderation is not configured", 503);
  const after = req.body.after ? objectId(req.body.after) : null;
  const reviews = await Review.find(after ? { _id: { $gt: after } } : {})
    .sort({ _id: 1 })
    .limit(10);
  const results = [];
  for (const review of reviews) {
    const order = await Order.findOne({
      user: review.user,
      "orderItems.productId": String(review.product),
      isDelivered: true,
    }).sort({ createdAt: -1 });
    try {
      const { data } = await axios.post(
        process.env.REVIEW_ML_URL,
        {
          review_text: review.comment,
          rating: review.rating,
          review_time: review.createdAt.toISOString(),
          order_time: order?.createdAt?.toISOString() || null,
        },
        { timeout: 2000, maxRedirects: 0 },
      );
      results.push({ reviewId: review._id, prediction: data });
    } catch {
      results.push({ reviewId: review._id, error: "Moderation unavailable" });
    }
  }
  res.json({
    results,
    next: reviews.length === 10 ? reviews.at(-1)._id : null,
  });
};
