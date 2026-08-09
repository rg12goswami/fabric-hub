import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getSupplier() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token && verifyToken(token);
  return decoded?.role === "supplier" ? decoded : null;
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).populate("supplier", "name businessName");
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const decoded = await getSupplier();
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    const product = await Product.findOneAndUpdate(
      { _id: id, supplier: decoded.userId },
      body,
      { new: true }
    );

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const decoded = await getSupplier();
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } = await params;
    const product = await Product.findOneAndDelete({ _id: id, supplier: decoded.userId });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
