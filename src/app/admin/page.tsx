"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(json => { if (json.success) setStats(json.stats); });
  }, []);

  if (!stats) return <div className="p-10">Loading Dashboard...</div>;

  const cards = [
    { title: "Total Sales", value: `$${stats.totalSales}`, icon: "💰", color: "bg-green-100 text-green-700" },
    { title: "Total Orders", value: stats.orderCount, icon: "📦", color: "bg-blue-100 text-blue-700" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "bg-yellow-100 text-yellow-700" },
    { title: "Total Cakes", value: stats.cakeCount, icon: "🎂", color: "bg-pink-100 text-pink-700" },
    { title: "Enquiries", value: stats.messageCount, icon: "📧", color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-cake-brown mb-8">Business Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
              {card.icon}
            </div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-cake-brown">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Links Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-cake-brown p-8 rounded-3xl text-white">
          <h2 className="text-xl font-bold mb-4">Need to add a new creation?</h2>
          <p className="text-cake-cream/70 mb-6">Apne naye cake designs aur flavors ko yahan se list karein.</p>
          <a href="/admin/add-cake" className="bg-cake-gold px-6 py-3 rounded-xl font-bold inline-block hover:scale-105 transition">
            Add New Cake
          </a>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-cake-gold/20 shadow-sm">
          <h2 className="text-xl font-bold text-cake-brown mb-4">Manage Orders</h2>
          <p className="text-gray-500 mb-6">Pending orders check karein aur delivery status update karein.</p>
          <a href="/admin/orders" className="text-cake-gold font-bold underline">
            View All Orders →
          </a>
        </div>
      </div>
    </div>
  );
}