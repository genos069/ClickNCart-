import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
        price: Number,
        quantity: Number,
      },
    ],

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
      required: true,
    },

    shippingMethod: {
      type: String,
      required: true,
    },

    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    discountAmount: Number,
    total: Number,

    isPaid: {
      type: Boolean,
      default: false,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);