// src/models/Product.js
import mongoose from "mongoose";

import "./User"; // ensures User schema is registered before populate() is used

const ProductSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    images: [String],
    colors: [String],
    specifications: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);