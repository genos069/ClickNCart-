import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  applyPromoCode,
  updateCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.post("/promo", protect, applyPromoCode);
router.patch("/update", protect, updateCartItem);

export default router;