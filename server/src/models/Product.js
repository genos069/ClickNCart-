import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Audio",
        "Wearables",
        "Computers",
        "Photography",
        "Mobile",
        "Gaming",
        "Tablets",
        "Fashion",
      ],
      index: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        review: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
          required: true,
        },
      },
    ],
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

productSchema.pre("save", async function (next) {
  try {
    let finalRating = null;

    // 1️⃣ If reviews exist → compute from Review model
    if (this.reviews && this.reviews.length > 0) {
      const Review = mongoose.model("Review");

      const reviewIds = this.reviews.map((r) => r.review);

      const result = await Review.aggregate([
        { $match: { _id: { $in: reviewIds } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
          },
        },
      ]);

      if (result.length > 0) {
        finalRating = result[0].avgRating;
      }
    }

    // 2️⃣ If no reviews OR no rating found → fallback random
    if (!finalRating) {
      finalRating = Math.random() * (4.9 - 3.5) + 3.5;
    }

    // 3️⃣ Save final rating (rounded)
    this.rating = +finalRating.toFixed(1);

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Product", productSchema);
