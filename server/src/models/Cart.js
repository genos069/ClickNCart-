import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    schemaVersion: { type: Number, default: 2 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: { type: Number, required: true, min: 0 },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 99,
          validate: Number.isInteger,
        },
        image: String,
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    promoCode: {
      type: String,
    },
    shippingMethod: {
      type: String,
      default: "standard",
      enum: ["standard", "express"],
    },
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod"],
    },
  },
  { timestamps: true, optimisticConcurrency: true },
);

export default mongoose.model("Cart", cartSchema);
