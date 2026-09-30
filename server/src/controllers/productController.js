import { fail, text, objectId } from "../utils/validation.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      originalPrice,
      image,
      category,
      description,
      features,
      inStock,
    } = req.body;

    if (!name || !price || !image || !category || !description || !brand) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // 🔥 AUTO CREATE OR FIND BRAND
    let brandDoc;

    if (brand) {
      brandDoc = await Brand.findOne({ name: brand }).collation({
        locale: "en",
        strength: 2,
      });
    }

    if (!brandDoc) {
      return res.status(400).json({ message: "Provided brand is not exist" });
    }

    const exists = await Product.findOne({
      name,
      brand: brandDoc._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    let discount = 0;
    if (originalPrice && originalPrice > price) {
      discount = Number(
        (((originalPrice - price) / originalPrice) * 100).toFixed(2),
      );
    }

    const product = await Product.create({
      name,
      brand: brandDoc._id,
      price,
      originalPrice,
      image,
      category,
      description,
      features: Array.isArray(features) ? features : [],
      inStock: inStock ?? true,
      discount,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (req, res) => {
  const q = req.query,
    query = {};
  const numeric = (value, fallback, max) => {
    if (value === undefined) return fallback;
    if (typeof value !== "string" || !value.trim())
      fail("Invalid numeric filter");
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > max) fail("Invalid numeric filter");
    return n;
  };
  const page = numeric(q.page, 1, 10000),
    limit = numeric(q.limit, 24, 100);
  if (
    !Number.isInteger(page) ||
    !Number.isInteger(limit) ||
    page < 1 ||
    limit < 1
  )
    fail("Invalid pagination");
  if (q.search) {
    const search = text(q.search, "search", 100).replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    query.$or = ["name", "description", "category"].map((k) => ({
      [k]: { $regex: search, $options: "i" },
    }));
  }
  if (q.category)
    query.category = {
      $in: text(q.category, "category", 1000)
        .split(",")
        .map((s) => s.trim()),
    };
  if (q.brand) query.brand = objectId(q.brand);
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    query.price = { $gte: numeric(q.minPrice, 0, 1e9) };
    if (q.maxPrice !== undefined)
      query.price.$lte = numeric(q.maxPrice, 1e9, 1e9);
    if (query.price.$lte < query.price.$gte) fail("Invalid price range");
  }
  if (q.minRating !== undefined)
    query.rating = { $gte: numeric(q.minRating, 0, 5) };
  if (q.inStock !== undefined) {
    if (!["true", "false"].includes(q.inStock)) fail("Invalid stock filter");
    query.inStock = q.inStock === "true";
  }
  if (q.sale === "true") query.discount = { $gt: 0 };
  const sorts = {
    featured: { createdAt: -1 },
    newest: { createdAt: -1 },
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    rating: { rating: -1 },
  };
  if (q.sortBy && !Object.hasOwn(sorts, q.sortBy)) fail("Invalid sort");
  const [data, total] = await Promise.all([
    Product.find(query)
      .sort({ ...sorts[q.sortBy || "featured"], _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(query),
  ]);
  res.json({
    success: true,
    data,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};
export const getFilters = async (req, res) => {
  const [categories, highest] = await Promise.all([
    Product.distinct("category"),
    Product.findOne().sort({ price: -1 }).select("price"),
  ]);
  res.json({ categories, maxPrice: Math.ceil(highest?.price || 0) });
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ❌ prevent unsafe fields
    const unsafeFields = ["_id", "createdAt", "updatedAt"];
    unsafeFields.forEach((f) => delete req.body[f]);

    // validate brand if updated
    if (req.body.brand) {
      const brandExists = await Brand.findById(req.body.brand);
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    for (const field of [
      "name",
      "brand",
      "price",
      "originalPrice",
      "image",
      "images",
      "category",
      "description",
      "features",
      "inStock",
    ]) {
      if (Object.hasOwn(req.body, field)) product[field] = req.body[field];
    }

    // recalc discount if prices updated
    if (product.originalPrice && product.price) {
      product.discount =
        product.originalPrice > product.price
          ? Number(
              (
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                100
              ).toFixed(2),
            )
          : 0;
    }

    const updated = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    throw error;
  }
};

export const seedProduct = async (req, res) => {
  if (!Array.isArray(req.body) || !req.body.length || req.body.length > 100)
    fail("Provide 1–100 products");
  const data = [],
    errors = [];
  for (const [index, row] of req.body.entries()) {
    try {
      const name = text(row.brand, "brand", 100);
      const brand = await Brand.findOneAndUpdate(
        { name },
        { $setOnInsert: { name } },
        {
          upsert: true,
          new: true,
          runValidators: true,
          collation: { locale: "en", strength: 2 },
        },
      );
      const product = new Product({
        name: row.name,
        brand: brand._id,
        price: row.price,
        originalPrice: row.originalPrice,
        image: row.image,
        category: row.category,
        description: row.description,
        features: row.features,
        inStock: row.inStock,
      });
      product.discount =
        product.originalPrice > product.price
          ? Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                10000,
            ) / 100
          : 0;
      await product.save();
      data.push(product);
    } catch (error) {
      errors.push({
        index,
        message:
          error.name === "ValidationError"
            ? error.message
            : "Product could not be imported",
      });
    }
  }
  res
    .status(errors.length ? 207 : 201)
    .json({ success: !errors.length, inserted: data.length, data, errors });
};

export const updateProductRating = async (productId) => {
  const Review = mongoose.model("Review");

  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = result[0]?.avgRating || 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(avgRating.toFixed(1)),
    reviews: result[0]?.count || 0,
  });
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    throw error;
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: id }, // exclude current product
    }).limit(4);

    res.json({
      success: true,
      data: related,
    });
  } catch (err) {
    throw err;
  }
};

export const getProductsForFrontend = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name logo")
      .sort({ createdAt: -1 })
      .limit(50);

    const formatted = products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: p.category,
      rating: p.rating,
      reviews: p.reviews,
      description: p.description,
      features: p.features,
      inStock: p.inStock,
      discount: p.discount,

      brand: p.brand
        ? {
            id: p.brand._id,
            name: p.brand.name,
            logo: p.brand.logo,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    throw error;
  }
};
