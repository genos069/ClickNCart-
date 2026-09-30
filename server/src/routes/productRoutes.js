import { protect, admin } from "../middleware/authMiddleware.js";
import express from "express";
import {
  getFilters,
  createProduct,
  getProducts,
  seedProduct,
  editProduct,
  getProductById,
  getProductsForFrontend,
  getRelatedProducts,
} from "../controllers/productController.js";

const router = express.Router();

// use to create product
router.post("/create", protect, admin, createProduct);
router.post("/seed", protect, admin, seedProduct);

//use to edit a specific part of product
router.post("/edit/:id", protect, admin, editProduct);

// Use to search any item through search bar
router.get("/list", getProducts);

// Use to get data for brand page
router.get("/all", getProductsForFrontend);

// After Search when we click any product it open wile taking its id
router.get("/filters", getFilters);
router.get("/:id", getProductById);
// we get related product in product page
router.get("/related/:id", getRelatedProducts);

export default router;
