import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) : null;
}

// GET orders — buyer sees their orders, supplier sees orders for their products
export async function GET() {
  try {
    await connectDB();
    const decoded = await getUserFromCookies();
    if (!decoded) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    let orders;
    if (decoded.role === "buyer") {
      orders = await Order.find({ buyer: decoded.userId })
        .populate("items.product")
        .populate("supplier", "name businessName")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ supplier: decoded.userId })
        .populate("items.product")
        .populate("buyer", "name email")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create order from cart (checkout)
export async function POST(req) {
  try {
    await connectDB();
    const decoded = await getUserFromCookies();
    if (!decoded) return NextResponse.json({ error: "Please login first" }, { status: 401 });

    const { shippingInfo } = await req.json();

    const cart = await Cart.findOne({ buyer: decoded.userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Group items by supplier (in case cart has products from multiple suppliers)
    const groupedBySupplier = {};
    for (const item of cart.items) {
      const supplierId = item.product.supplier.toString();
      if (!groupedBySupplier[supplierId]) groupedBySupplier[supplierId] = [];
      groupedBySupplier[supplierId].push(item);
    }

    const createdOrders = [];
    for (const supplierId of Object.keys(groupedBySupplier)) {
      const items = groupedBySupplier[supplierId];
      const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

      const order = await Order.create({
        buyer: decoded.userId,
        supplier: supplierId,
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        totalAmount,
        shippingInfo,
        status: "Pending",
      });

      createdOrders.push(order);
    }

    // Clear cart after order
    cart.items = [];
    await cart.save();

    return NextResponse.json({ orders: createdOrders }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
