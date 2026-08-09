"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

const statuses = ["Pending", "Accepted", "Preparing", "Ready for Dispatch", "Completed"];

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-600",
  Accepted: "bg-blue-50 text-blue-600",
  Preparing: "bg-purple-50 text-purple-600",
  "Ready for Dispatch": "bg-orange-50 text-orange-600",
  Completed: "bg-green-50 text-green-600",
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl text-center py-16 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{order.buyer?.name} · {order.buyer?.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.product?.name} x{item.quantity}</span>
                      <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
