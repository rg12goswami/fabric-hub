"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({ address: "", city: "", zip: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingInfo: form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order");
        setLoading(false);
        return;
      }

      router.push("/dashboard?ordered=true");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
        )}

        <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700">Shipping Information</h2>

          <input
            name="address"
            placeholder="Street Address"
            value={form.address}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              name="zip"
              placeholder="ZIP Code"
              value={form.zip}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium mt-2 transition disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
