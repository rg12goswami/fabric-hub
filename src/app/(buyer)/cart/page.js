// src/app/(buyer)/cart/page.js
"use client";

import { useEffect, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart || { items: [] });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    fetchCart();
  };

  const total = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl divide-y divide-gray-100 mb-6">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 p-4">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-sm text-gray-500">${item.product.price}/m</p>
                  </div>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                      <Minus size={14} className="text-gray-500" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                      <Plus size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <p className="font-medium text-gray-800 w-16 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button onClick={() => removeItem(item.product._id)}>
                    <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Total: ${total.toFixed(2)}</span>
              <button
                onClick={() => router.push("/checkout")}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}