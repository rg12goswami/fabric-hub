// scripts/seed.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  supplier: mongoose.Schema.Types.ObjectId,
  name: String,
  category: String,
  description: String,
  images: [String],
  colors: [String],
  price: Number,
  stock: Number,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  { name: "Egyptian Cotton", category: "Cotton", description: "Premium soft cotton", images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400"], colors: ["#D85A30", "#1D9E75"], price: 8.5, stock: 200 },
  { name: "Mulberry Silk", category: "Silk", description: "Luxurious silk fabric", images: ["https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400"], colors: ["#534AB7", "#D4537E"], price: 24, stock: 80 },
  { name: "Belgian Linen", category: "Linen", description: "Breathable linen", images: ["https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400"], colors: ["#639922", "#888780"], price: 12, stock: 150 },
  { name: "Merino Wool", category: "Wool", description: "Warm wool blend", images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"], colors: ["#BA7517", "#333"], price: 18, stock: 60 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products.map(p => ({ ...p, supplier: new mongoose.Types.ObjectId() })));
  console.log("Seeded!");
  process.exit(0);
}

seed();