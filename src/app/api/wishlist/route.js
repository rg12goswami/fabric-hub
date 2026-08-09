import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) : null;
}

export async function GET() {
  try {
    await connectDB();
    const decoded = await getUser();
    if (!decoded) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const user = await User.findById(decoded.userId).populate("wishlist");
    return NextResponse.json({ wishlist: user?.wishlist || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const decoded = await getUser();
    if (!decoded) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { productId } = await req.json();
    const user = await User.findById(decoded.userId);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();

    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
