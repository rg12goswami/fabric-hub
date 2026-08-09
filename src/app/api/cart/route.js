// src/app/api/cart/route.js
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) : null;
}

// GET current user's cart
export async function GET() {
  try {
    await connectDB();
    const decoded = await getUserFromCookies();
    if (!decoded) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const cart = await Cart.findOne({ buyer: decoded.userId }).populate("items.product");
    return NextResponse.json({ cart: cart || { items: [] } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST add item to cart
export async function POST(req) {
  try {
    await connectDB();
    const decoded = await getUserFromCookies();
    if (!decoded) return NextResponse.json({ error: "Please login first" }, { status: 401 });

    const { productId, quantity } = await req.json();

    let cart = await Cart.findOne({ buyer: decoded.userId });

    if (!cart) {
      cart = await Cart.create({ buyer: decoded.userId, items: [{ product: productId, quantity }] });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// DELETE remove item from cart
export async function DELETE(req) {
  try {
    await connectDB();
    const decoded = await getUserFromCookies();
    if (!decoded) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { productId } = await req.json();

    const cart = await Cart.findOne({ buyer: decoded.userId });
    if (cart) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
      await cart.save();
    }

    return NextResponse.json({ message: "Removed from cart" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

// PATCH update quantity
export async function PATCH(req) {
  try {
    await connectDB();
    const decoded = await getUserFromCookies();
    if (!decoded) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { productId, quantity } = await req.json();

    const cart = await Cart.findOne({ buyer: decoded.userId });
    if (cart) {
      const item = cart.items.find((i) => i.product.toString() === productId);
      if (item) item.quantity = quantity;
      await cart.save();
    }

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}