import express from "express";
import { placeOrder, getOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, getOrder);

router.post("/", protect, placeOrder);

export default router;
