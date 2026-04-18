import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  applyPromoCode,
  updateCartItem,
  updateShipping,
  saveShippingAddress,
} from "../controllers/cartController.js";
import { savePaymentMethod } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { applyAIDiscount } from "../controllers/aiController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.post("/promo", protect, applyPromoCode);
router.patch("/update", protect, updateCartItem);
router.put("/shipping", protect, updateShipping);
router.put("/address", protect, saveShippingAddress);
router.post("/apply-ai-discount", protect, applyAIDiscount);


export default router;