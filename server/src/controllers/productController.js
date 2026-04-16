import mongoose from "mongoose";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";

export const createProduct = async (req, res) => {
  console.log("🔥 CONTROLLER HIT");
  console.log("BODY:", req.body);
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
      brandDoc = await Brand.findOne({ name: brand });
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
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page = 1,
      limit = 10,
    } = req.query;

    // Build dynamic query
    let query = {};

    // 🔎 Keyword search (Amazon-style)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷️ Category filter
    if (category) {
      query.category = category;
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ⭐ Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // 📦 Stock filter
    if (inStock !== undefined) {
      query.inStock = inStock === "true";
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    // Fetch products
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Total count (for frontend pagination)
    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
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

    Object.assign(product, req.body);

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
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const seedProduct = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of products",
      });
    }

    // 1. validate + collect brand names (ORIGINAL case)
    const brandNames = new Set();

    for (const p of products) {
      if (
        !p.name ||
        !p.price ||
        !p.image ||
        !p.category ||
        !p.description ||
        !p.brand
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      brandNames.add(p.brand.trim()); // ✅ keep original case
    }

    const brandArray = [...brandNames];

    // 2. fetch existing brands (case-insensitive)
    const existingBrands = await Brand.find({
      name: { $in: brandArray },
    });

    // 3. create map using LOWERCASE key for matching
    const brandMap = new Map();

    existingBrands.forEach((b) => {
      brandMap.set(b.name.toLowerCase(), b._id);
    });

    // 4. find missing brands (case-insensitive)
    const brandsToCreate = brandArray
      .filter((name) => !brandMap.has(name.toLowerCase()))
      .map((name) => ({
        name: name, // ✅ keep original casing
      }));

    if (brandsToCreate.length) {
      const created = await Brand.insertMany(brandsToCreate);

      created.forEach((b) => {
        brandMap.set(b.name.toLowerCase(), b._id);
      });
    }

    // 5. filter existing products
    const productNames = products.map((p) => p.name);

    const existingProducts = await Product.find({
      name: { $in: productNames },
    }).select("name");

    const existingSet = new Set(existingProducts.map((p) => p.name));

    // 6. format products
    const formattedProducts = products
      .filter((p) => !existingSet.has(p.name))
      .map((p) => {
        const discount =
          p.originalPrice && p.price
            ? Number(
                (((p.originalPrice - p.price) / p.originalPrice) * 100).toFixed(
                  2,
                ),
              )
            : 0;

        const brandId = brandMap.get(p.brand.trim().toLowerCase());

        if (!brandId) {
          console.warn("❌ Brand not found:", p.brand);
        }

        return {
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          category: p.category,
          description: p.description,
          features: p.features || [],
          inStock: p.inStock ?? true,
          brand: brandId, // ✅ always ObjectId
          discount,
        };
      });

    // 7. insert
    const result =
      formattedProducts.length > 0
        ? await Product.insertMany(formattedProducts, { ordered: false })
        : [];

    return res.status(201).json({
      success: true,
      message: "Seeding completed",
      inserted: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProductRating = async (productId) => {
  const Review = mongoose.model("Review");

  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const avgRating = result[0]?.avgRating || 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(avgRating.toFixed(1)),
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

    console.log(product);

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
    res.status(500).json({ message: err.message });
  }
};

// future change

export const getProductsForFrontend = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name logo")
      .sort({ createdAt: -1 });

    const formatted = products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: p.category,
      rating: p.rating,
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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
