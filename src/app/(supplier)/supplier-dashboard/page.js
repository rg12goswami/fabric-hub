"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Clock, TrendingUp } from "lucide-react";

export default function SupplierDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, pendingOrders: 0, recentOrders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products/mine").then((res) => res.json()),
      fetch("/api/orders").then((res) => res.json()),
    ]).then(([productsData, ordersData]) => {
      const products = productsData.products || [];
      const orders = ordersData.orders || [];

      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isAvailable).length,
        pendingOrders: orders.filter((o) => o.status === "Pending").length,
        recentOrders: orders.slice(0, 5),
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Active Products", value: stats.activeProducts, icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Supplier Dashboard</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${card.color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            );
          })}
        </div>

        <h2 className="font-semibold text-gray-700 mb-3">Recent Orders</h2>

        {stats.recentOrders.length === 0 ? (
          <div className="bg-white rounded-2xl text-center py-16 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">{order.buyer?.name}</p>
                </div>
                <span className="text-sm font-medium text-gray-800">${order.totalAmount.toFixed(2)}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
