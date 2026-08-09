"use client";

import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2 } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-600",
  Accepted: "bg-blue-50 text-blue-600",
  Preparing: "bg-purple-50 text-purple-600",
  "Ready for Dispatch": "bg-orange-50 text-orange-600",
  Completed: "bg-green-50 text-green-600",
};

export default function BuyerDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((res) => res.json()),
      fetch("/api/orders").then((res) => res.json()),
    ]).then(([meData, ordersData]) => {
      setUser(meData.user);
      setOrders(ordersData.orders || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h1>

        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-gray-700 mb-3">Profile</h2>
          <p className="text-gray-800 font-medium">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Orders */}
        <h2 className="font-semibold text-gray-700 mb-3">Order History</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl text-center py-16 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product?.name} x{item.quantity}
                      </span>
                      <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
