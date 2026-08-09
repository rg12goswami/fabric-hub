// src/app/api/products/route.js
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = { isAvailable: true };
    if (category && category !== "All") {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("supplier", "name businessName")
      .sort({ createdAt: -1 });

    const formatted = products.map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      description: p.description,
      images: p.images,
      colors: p.colors,
      price: p.price,
      stock: p.stock,
      isAvailable: p.isAvailable,
      supplierName: p.supplier?.businessName || p.supplier?.name || "Supplier",
      supplierId: p.supplier?._id,
    }));

    return NextResponse.json({ products: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = token && verifyToken(token);

    if (!decoded || decoded.role !== "supplier") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, description, images, colors, specifications, price, stock } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 });
    }

    const product = await Product.create({
      supplier: decoded.userId,
      name,
      category,
      description,
      images: images || [],
      colors: colors || [],
      specifications,
      price,
      stock: stock || 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}