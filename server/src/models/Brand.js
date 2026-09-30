import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String, // URL or image path
      required: false,
    },

    description: {
      type: String,
      required: false,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String, // e.g. "from-blue-600 to-blue-700"
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

export default mongoose.model("Brand", brandSchema);
