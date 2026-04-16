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
router.post("/", createBrand);
router.post("/seed", seedBrands);

// get a brand
router.get("/", brandPage);

// get a brand through id
router.get("/:id", getBrandById);

// update a brand
router.put("/:id", updateBrand);

// delete a brand
router.delete("/:id", deleteBrand);


export default router