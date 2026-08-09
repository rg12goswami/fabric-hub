"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categoryOptions = ["Apparel", "Home Textiles", "Upholstery", "Accessories"];
const fabricOptions = ["Cotton", "Silk", "Linen", "Wool", "Synthetic"];

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "buyer";

  const [form, setForm] = useState({
    businessType: "",
    industry: "",
    productCategories: [],
    preferredFabricTypes: [],
    typicalOrderQuantity: "",
    budgetRange: "",
  });
  const [saving, setSaving] = useState(false);

  if (role !== "buyer") {
    if (typeof window !== "undefined") router.push("/supplier-dashboard");
    return null;
  }

  const toggleValue = (field, value) => {
    setForm((prev) => {
      const list = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];
      return { ...prev, [field]: list };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/marketplace");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tell us about your business</h1>
        <p className="text-gray-500 text-sm mb-6">This helps us personalize your marketplace experience.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Business Type</label>
            <input
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              placeholder="e.g. Boutique, Manufacturer, Designer"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Industry</label>
            <input
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              placeholder="e.g. Fashion, Home Decor"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Product Categories of Interest</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleValue("productCategories", cat)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    form.productCategories.includes(cat)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Fabric Types</label>
            <div className="flex flex-wrap gap-2">
              {fabricOptions.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => toggleValue("preferredFabricTypes", f)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    form.preferredFabricTypes.includes(f)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Typical Order Quantity</label>
              <input
                value={form.typicalOrderQuantity}
                onChange={(e) => setForm({ ...form, typicalOrderQuantity: e.target.value })}
                placeholder="e.g. 100-500m"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Budget Range</label>
              <input
                value={form.budgetRange}
                onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                placeholder="e.g. $500-$2000"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue to Marketplace"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}
