"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

const colorMap = {
  cotton: "bg-orange-100",
  silk: "bg-purple-100",
  linen: "bg-green-100",
  wool: "bg-blue-100",
};

export default function ProductCard({ product, isWishlisted = false }) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const bg = colorMap[product.category?.toLowerCase()] || "bg-gray-100";

  const toggleWishlist = async (e) => {
    e.preventDefault();
    setWishlisted((prev) => !prev);
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
  };

  const productUrl = "/product/" + product._id;

  return (
    <Link
      href={productUrl}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
    >
      <div className={`h-32 ${bg} relative flex items-center justify-center`}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
        <p className="text-xs text-gray-500 mb-2">{product.supplierName || "Supplier"}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">${product.price}/m</span>
          <div className="flex gap-1">
            {product.colors?.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-white ring-1 ring-gray-200"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
