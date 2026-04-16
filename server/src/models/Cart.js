import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    promoCode: {
      type: String,
    },
    shippingMethod: {
      type: String,
      default: "standard",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);