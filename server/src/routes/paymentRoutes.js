import express from "express";
import { savePaymentMethod } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, savePaymentMethod);

export default router;