// src/app/(buyer)/marketplace/page.js
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/buyer/ProductCard";
import HeroCarousel from "@/components/buyer/HeroCarousel";

const categories = ["All", "Cotton", "Silk", "Linen", "Wool"];

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero banner - auto sliding */}
        <HeroCarousel products={products} />

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search fabrics, colors, suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}