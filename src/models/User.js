// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "supplier"], required: true },

    // Buyer onboarding fields
    businessType: String,
    industry: String,
    productCategories: [String],
    preferredFabricTypes: [String],
    typicalOrderQuantity: String,
    budgetRange: String,

    // Supplier onboarding fields
    businessName: String,
    contactInfo: String,
    businessAddress: String,
    operatingHours: String,
    fabricTypesOffered: [String],
    minimumOrderQuantity: String,

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);