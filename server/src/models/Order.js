import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    checkoutKey: { type: String, required: true },
    estimatedDelivery: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        productId: String,
        name: String,
        image: String,
        price: { type: Number, required: true, min: 0 },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 99,
          validate: Number.isInteger,
        },
      },
    ],

    shippingAddress: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zip: { type: String, required: true, trim: true },
    },

    paymentMethod: {
      type: String,
      enum: ["cod"],
      required: true,
    },

    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      required: true,
    },

    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },

    isPaid: {
      type: Boolean,
      default: false,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

orderSchema.index(
  { user: 1, checkoutKey: 1 },
  {
    unique: true,
    partialFilterExpression: { checkoutKey: { $type: "string" } },
  },
);

export default mongoose.model("Order", orderSchema);
