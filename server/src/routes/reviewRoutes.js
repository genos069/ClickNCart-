import express from "express";

import {
  createReview,
  getProductReviews,
} from "../controllers/reviewControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create/:productId", protect, createReview);

router.get("/product/get/:productId", getProductReviews);

export default router;
