import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = token && verifyToken(token);

    if (!decoded || decoded.role !== "supplier") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const products = await Product.find({ supplier: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
