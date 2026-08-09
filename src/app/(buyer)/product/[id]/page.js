// src/app/(buyer)/product/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductDetailPage({ params }) {
  const [id, setId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.resolve(params).then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    setMessage("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      if (res.ok) {
        setMessage("Added to cart!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Please login first");
      }
    } catch {
      setMessage("Something went wrong");
    }
    setAdding(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-96 object-cover" />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-300">No image</div>
            )}
          </div>

          <div>
            <p className="text-sm text-teal-600 font-medium mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">
              Sold by {product.supplier?.businessName || product.supplier?.name || "Supplier"}
            </p>

            <p className="text-3xl font-bold text-gray-800 mb-6">${product.price}/m</p>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Available Colors</p>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-2">
              Stock: <span className="font-medium text-gray-800">{product.stock} m available</span>
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
              <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 transition">
                <Heart size={18} />
              </button>
            </div>

            {message && <p className="text-sm mt-3 text-teal-600">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}