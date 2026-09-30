import Brand from "../models/Brand.js";
import Product from "../models/Product.js";

export const createBrand = async (req, res) => {
  try {
    const { name, logo, description, rating, featured, color } = req.body;

    const existing = await Brand.findOne({ name }).collation({
      locale: "en",
      strength: 2,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name,
      logo,
      description,
      rating,
      featured,
      color,
    });

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    throw error;
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    throw error;
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (await Product.exists({ brand: id }))
      return res.status(409).json({ message: "Brand still has products" });
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const getBrandsForFrontend = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    const products = await Product.find();

    const formatted = brands.map((b) => {
      const productCount = products.filter(
        (p) => p.brand?.toString() === b._id.toString(),
      ).length;

      return {
        id: b._id,
        name: b.name,
        logo: b.logo,
        description: b.description,
        rating: b.rating,
        featured: b.featured,
        color: b.color,
        products: productCount,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    throw error;
  }
};

// frontend homepage needs BOTH brands + products:
export const getHomePageData = async (req, res) => {
  try {
    const [products, brands] = await Promise.all([
      Product.find().populate("brand"),
      Brand.find(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products,
        brands,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const seedBrands = async (req, res) => {
  try {
    const brands = req.body;

    if (!Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send an array of brands",
      });
    }

    const formatted = [];

    for (const b of brands) {
      if (!b.name || !b.logo) {
        continue; // skip invalid entries
      }

      // avoid duplicates
      const exists = await Brand.findOne({ name: b.name }).collation({
        locale: "en",
        strength: 2,
      });
      if (exists) continue;

      formatted.push({
        name: b.name,
        logo: b.logo,
        description: b.description || "",
        rating: b.rating ?? 0,
        featured: b.featured ?? false,
        color: b.color || "",
      });
    }

    const result =
      formatted.length > 0 ? await Brand.insertMany(formatted) : [];

    return res.status(201).json({
      success: true,
      message: "Brands seeded successfully",
      inserted: result.length,
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

// test
export const brandPage = async (req, res) => {
  try {
    const brands = await Brand.find();

    const result = await Promise.all(
      brands.map(async (brand) => {
        const count = await Product.countDocuments({
          brand: brand._id,
        });

        return {
          ...brand.toObject(),
          products: count,
        };
      }),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
};
