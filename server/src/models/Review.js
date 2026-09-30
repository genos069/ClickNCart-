import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    verifiedPurchase: { type: Boolean, default: false },
    purchasedAt: Date,
    rating: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
      max: 5,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    comment: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate reviews
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
