"use client";

import { useEffect, useState } from "react";

export default function SupplierProfilePage() {
  const [form, setForm] = useState({
    businessName: "", contactInfo: "", businessAddress: "", operatingHours: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setForm({
            businessName: data.user.businessName || "",
            contactInfo: data.user.contactInfo || "",
            businessAddress: data.user.businessAddress || "",
            operatingHours: data.user.operatingHours || "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("Profile updated!");
    } else {
      setMessage("Failed to update");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Profile</h1>

        {message && (
          <div className="bg-teal-50 text-teal-600 text-sm rounded-lg px-4 py-2 mb-4">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Business Name</label>
            <input
              name="businessName" value={form.businessName} onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Contact Information</label>
            <input
              name="contactInfo" value={form.contactInfo} onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Business Address</label>
            <input
              name="businessAddress" value={form.businessAddress} onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Operating Hours</label>
            <input
              name="operatingHours" value={form.operatingHours} onChange={handleChange}
              placeholder="e.g. Mon-Fri 9am-6pm"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit" disabled={saving}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
