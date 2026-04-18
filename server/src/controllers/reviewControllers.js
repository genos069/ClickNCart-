import axios from "axios";
import Review from "../models/Review.js";
import { updateProductRating } from "./productController.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

export const createReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;

    const userId = req.user.id;

    if (!rating || !comment || !productId || !title) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // prevent duplicate review by SAME USER
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const cart = await Cart.findOne({
      userId: userId,
      productId: productId,
    }).sort({ createdAt: -1 });

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
    });

    await updateProductRating(productId);

    let mlResult = null;

    try {
      mlResult = await axios.post("http://localhost:8000/predict", {
        review_text: comment,
        rating: rating,
        review_time: review.createdAt ? review.createdAt.toISOString() : null,
        order_time: cart?.createdAt ? cart.createdAt.toISOString() : null,
      });

      console.log("ML RESULT:", mlResult.data);
    } catch (mlError) {
      console.error("ML Error:", mlError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
      mlPrediction: mlResult?.data || null,
    });
    
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name email",
    );

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitReview = async (req, res) => {
  try {
    const reviews = await Review.find();

    const carts = await Cart.find();

    // ⚡ convert carts into map for faster lookup
    const cartMap = new Map();

    carts.forEach((cart) => {
      if (cart.userId) {
        cartMap.set(cart.userId.toString(), cart);
      }
    });

    // ⚡ parallel ML calls
    const promises = reviews.map(async (review) => {
      const cart = cartMap.get(review.user?.toString());

      const payload = {
        review_text: review.comment || "",
        rating: review.rating || 0,
        review_time: review.createdAt?.toISOString(),
        order_time: cart?.createdAt?.toISOString() || null,
      };

      const mlResult = await axios.post(
        "http://127.0.0.1:8000/predict",
        payload,
      );

      console.log("My Result", mlResult.data);

      return {
        reviewId: review._id,
        prediction: mlResult.data,
      };
    });

    const results = await Promise.all(promises);

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("ML API Error:", err?.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: "ML API failed",
    });
  }
};
