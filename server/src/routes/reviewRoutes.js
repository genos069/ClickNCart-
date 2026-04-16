import express from "express";

import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers.js";

const router = express.Router();

router.post("/", createReview);

router.get("/product/:productId", getProductReviews);

router.put("/:reviewId", updateReview);

router.delete("/:reviewId", deleteReview);

export default router;