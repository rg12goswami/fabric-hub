// src/app/register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Redirect to onboarding based on role
      router.push(`/onboarding?role=${form.role}`);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">I am a</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "buyer" })}
                className={`flex-1 py-2 rounded-lg border font-medium ${
                  form.role === "buyer"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "supplier" })}
                className={`flex-1 py-2 rounded-lg border font-medium ${
                  form.role === "supplier"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                Supplier
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}