"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";

const categories = ["Cotton", "Silk", "Linen", "Wool"];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "Cotton", description: "", price: "", stock: "", images: "", colors: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    fetch("/api/products/mine")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      images: form.images ? [form.images] : [],
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()) : [],
    };

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ name: "", category: "Cotton", description: "", price: "", stock: "", images: "", colors: "" });
    setShowForm(false);
    setSaving(false);
    fetchProducts();
  };

  const toggleAvailable = async (product) => {
    await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !product.isAvailable }),
    });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 mb-6 flex flex-col gap-3">
            <input
              name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              name="category" value={form.category} onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea
              name="description" placeholder="Description" value={form.description} onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="price" type="number" step="0.01" placeholder="Price per meter" value={form.price} onChange={handleChange} required
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                name="stock" type="number" placeholder="Stock (meters)" value={form.stock} onChange={handleChange}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm((prev) => ({ ...prev, images: reader.result }));
                  reader.readAsDataURL(file);
                }}
                className="border rounded-lg px-4 py-2 w-full text-sm"
              />
              {form.images && (
                <img src={form.images} alt="preview" className="w-20 h-20 rounded-lg object-cover mt-2" />
              )}
            </div>
            <input
              name="colors" placeholder="Colors (hex codes, comma separated e.g. #FF0000, #00FF00)" value={form.colors} onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit" disabled={saving}
              className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl text-center py-16 text-gray-400">
            <p>No products yet. Add your first one!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product._id} className="flex items-center gap-4 p-4">
                <img
                  src={product.images?.[0]} alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category} · ${product.price}/m · Stock: {product.stock}m</p>
                </div>
                <button
                  onClick={() => toggleAvailable(product)}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    product.isAvailable ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {product.isAvailable ? "Available" : "Out of Stock"}
                </button>
                <button onClick={() => deleteProduct(product._id)}>
                  <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
