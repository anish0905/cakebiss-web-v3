"use client";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 12;

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const json = await res.json();
    if (json.success) setOrders(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      alert("Status Updated!");
      fetchOrders();
    }
  };

  const filteredOrders = activeTab === "All" ? orders : orders.filter((o: any) => o.status === activeTab);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Processing': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Shipped': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Delivered': return 'bg-green-100 text-green-900 border-green-300';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black"></div>
    </div>
  );

  return (
    <div className="p-3 md:p-10 bg-[#f4f4f4] min-h-screen font-sans text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif font-black text-black italic leading-tight">Bakery Orders</h1>
            <p className="text-gray-600 font-bold text-sm md:text-base">Real-time command center for CakeBiss.</p>
          </div>
          <div className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-3xl shadow-2xl flex justify-between items-center md:block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 md:block">Active Orders</span>
            <span className="text-2xl font-black">{filteredOrders.length}</span>
          </div>
        </div>

        {/* --- Status Tabs (Mobile Scrollable) --- */}
        <div className="overflow-x-auto no-scrollbar mb-8 -mx-3 px-3 md:mx-0 md:px-0">
          <div className="flex gap-2 min-w-max bg-white/50 p-2 rounded-[2rem] border border-gray-200">
            {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-black text-white shadow-xl scale-105" : "text-gray-500 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {currentOrders.length > 0 ? currentOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
              
              {/* Card Top Bar */}
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-black text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-lg">#{order._id.slice(-2)}</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</p>
                    <p className="text-xs font-mono font-black text-black break-all">#{order._id}</p>
                  </div>
                </div>
                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                   <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Amount Paid</p>
                      <p className="text-2xl font-black text-black">₹{order.totalAmount}</p>
                   </div>
                   <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black border-2 uppercase tracking-widest outline-none cursor-pointer transition-all ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Card Content Grid */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                
                {/* Section 1: Cake Details */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-black"></span> Menu Items
                  </h3>
                  <div className="space-y-2">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="font-black text-sm">{item.name} <span className="text-gray-400 ml-1">x{item.quantity}</span></span>
                        <span className="font-black text-sm">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Personalization (Highlighted) */}
                <div className="bg-cake-cream/20 p-6 md:p-8 rounded-[2.5rem] border-2 border-black/5 shadow-inner">
                  <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-black"></span> Customization
                  </h3>
                  <div className="space-y-4 text-sm font-black">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                       <span className="text-lg">📅</span> {order.deliveryDate}
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                       <span className="text-lg">🎈</span> {order.occasion}
                    </div>
                    <div className="mt-4 p-4 bg-black text-white rounded-2xl shadow-xl">
                       <p className="text-[9px] font-black uppercase opacity-50 mb-1">Cake Message</p>
                       <p className="text-base font-serif italic italic font-medium">"{order.cakeMessage || "None"}"</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Logistics */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Shipment To</h3>
                    <p className="text-sm font-black leading-snug text-black">{order.address}</p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-xs font-black">
                      📍 PIN: {order.pincode}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Customer Hotline</h3>
                    <a href={`tel:${order.phone}`} className="text-2xl font-black text-black hover:text-gray-600 transition-colors flex items-center gap-3">
                       <span className="text-xl">📞</span> {order.phone}
                    </a>
                    <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase">
                      Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
               <span className="text-6xl block mb-4">📭</span>
               <p className="text-gray-400 font-black uppercase tracking-widest">No orders in {activeTab}</p>
            </div>
          )}
        </div>

        {/* --- Responsive Pagination --- */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-16">
            <button 
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
              className="w-full md:w-auto px-10 py-5 rounded-[2rem] bg-black text-white text-xs font-black tracking-widest disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              PREVIOUS PAGE
            </button>
            <span className="text-sm font-black text-black bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm">
              {currentPage} / {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
              className="w-full md:w-auto px-10 py-5 rounded-[2rem] bg-black text-white text-xs font-black tracking-widest disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              NEXT PAGE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}