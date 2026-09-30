import { protect, admin } from "../middleware/authMiddleware.js";
import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  seedBrands,
  brandPage, //test
} from "../controllers/brandController.js";

const router = express.Router();

// create a brand
router.post("/", protect, admin, createBrand);
router.post("/seed", protect, admin, seedBrands);

// get a brand
router.get("/", brandPage);

// get a brand through id
router.get("/:id", getBrandById);

// update a brand
router.put("/:id", protect, admin, updateBrand);

// delete a brand
router.delete("/:id", protect, admin, deleteBrand);

export default router;
