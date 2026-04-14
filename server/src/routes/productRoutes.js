import express from "express";
import {
  createProduct,
  getProducts,
  seedProduct,
  editProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create", createProduct);
router.post("/seed", seedProduct);
router.post("/edit", editProduct);

router.get("/list", getProducts);

export default router;
