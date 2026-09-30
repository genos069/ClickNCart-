import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "Accessories",
        "Audio",
        "Cameras",
        "Computers",
        "Computing",
        "Display",
        "Fashion",
        "Gaming",
        "Health",
        "Kitchen",
        "Laptops",
        "Mobile",
        "Monitors",
        "Networking",
        "Office",
        "Photography",
        "Printers",
        "Smart Home",
        "Storage",
        "TVs",
        "Tablets",
        "Tech",
        "Transport",
        "Wearables",
        "Medical",
      ],
      index: true,
    },
    reviews: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
