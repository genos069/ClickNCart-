import Product from "../models/Product.js";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      image,
      category,
      description,
      features,
      inStock,
    } = req.body;

    // Basic validation
    if (!name || !price || !image || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const exists = await Product.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const discount = ((originalPrice - price) / originalPrice) * 100;

    // Create product
    const product = await Product.create({
      name,
      price,
      originalPrice,
      image,
      category,
      rating: rating ?? 0, // default if not provided
      description,
      features: features || [],
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
        message: "Product not found"
      });
    }

    // Only update fields that exist in request body
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    const updated = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product partially updated",
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
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

    const formattedProducts = [];

    for (const p of products) {
      if (!p.name || !p.price || !p.image || !p.category || !p.description) {
        throw new Error("Missing required fields in one of the products");
      }

      // check if exists
      const exists = await Product.findOne({ name: p.name });

      if (exists) {
        continue; // skip existing product
      }

      const discount =
        p.originalPrice && p.price
          ? ((p.originalPrice - p.price) / p.originalPrice) * 100
          : 0;

      formattedProducts.push({
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        category: p.category,
        description: p.description,
        features: p.features || [],
        inStock: p.inStock ?? true,
        rating: p.rating ?? 0,
        discount,
      });
    }

    const result =
      formattedProducts.length > 0
        ? await Product.insertMany(formattedProducts)
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
