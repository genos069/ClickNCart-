import Review from "../models/Review.js";
import { updateProductRating } from "./productController.js";
import User from "../models/User.js";


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

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
    });
    
    await updateProductRating(productId);
    
    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
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