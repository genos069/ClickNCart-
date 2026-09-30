import express from "express";

import {
  createReview,
  getProductReviews,
  submitReview,
} from "../controllers/reviewControllers.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create/:productId", protect, createReview);

router.get("/product/get/:productId", getProductReviews);

// ML model
router.post("/check", protect, admin, submitReview);

export default router;
