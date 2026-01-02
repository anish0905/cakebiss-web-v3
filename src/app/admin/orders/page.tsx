"use client";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const json = await res.json();
    if (json.success) setOrders(json.data);
  };

  useEffect(() => { fetchOrders(); }, []);

const updateStatus = async (id: string, newStatus: string) => {
  try {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Order Status Updated to: " + newStatus);
      fetchOrders(); // List ko refresh karein
    } else {
      console.error("Update failed:", data);
      alert("Failed to update: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-cake-brown mb-8">Customer Orders</h1>
      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-cake-gold/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-400">Order ID: {order._id}</p>
                <p className="font-bold text-lg text-cake-brown">Total: ${order.totalAmount}</p>
              </div>
              {/* Status Dropdown */}
              <select 
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="bg-cake-cream text-cake-brown p-2 rounded-lg border border-cake-gold/20 text-sm font-bold outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <p className="text-sm font-bold mb-2 underline">Items:</p>
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <p>📍 Address: {order.address}</p>
              <p>📞 Phone: {order.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}