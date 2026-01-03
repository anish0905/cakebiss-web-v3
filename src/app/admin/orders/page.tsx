"use client";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- New States for Pagination & Filtering ---
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

  // --- Logic: Filtering ---
  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter((o: any) => o.status === activeTab);

  // --- Logic: Pagination ---
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cake-gold"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-black text-black italic">Bakery Command Center</h1>
            <p className="text-gray-500 font-medium">Manage deliveries and special cake requests.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Total: </span>
            <span className="text-xl font-black text-cake-gold">{filteredOrders.length}</span>
          </div>
        </div>

        {/* --- Status Tabs --- */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 w-fit">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-black text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {currentOrders.length > 0 ? currentOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
              
              {/* Header */}
              <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-black">#{order._id.slice(-2)}</div>
                  <p className="text-sm font-mono font-bold text-black tracking-tighter">#{order._id}</p>
                </div>
                <div className="flex items-center gap-6">
                   <p className="text-xl font-black text-cake-gold">₹{order.totalAmount}</p>
                   <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest outline-none cursor-pointer ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Grid Content */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div>
                  <h3 className="text-[10px] uppercase font-black text-gray-300 mb-4 tracking-[0.2em]">Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-2xl text-sm font-bold">
                        <span>{item.name} <span className="text-cake-gold">x{item.quantity}</span></span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-cake-cream/10 p-6 rounded-[2rem] border border-cake-gold/20">
                  <h3 className="text-[10px] uppercase font-black text-cake-gold mb-4 tracking-[0.2em]">Special Request</h3>
                  <div className="space-y-3 text-sm font-bold">
                    <p>📅 Date: {order.deliveryDate}</p>
                    <p>🎈 Occasion: {order.occasion}</p>
                    <div className="mt-2 p-3 bg-white rounded-xl border border-cake-gold/10 italic text-cake-brown">"{order.cakeMessage}"</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[10px] uppercase font-black text-gray-300 mb-1 tracking-[0.2em]">Ship To</h3>
                    <p className="text-sm font-bold leading-tight">{order.address}</p>
                    <span className="text-[10px] font-black text-cake-gold underline uppercase">{order.pincode}</span>
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase font-black text-gray-300 mb-1 tracking-[0.2em]">Contact</h3>
                    <p className="text-lg font-black italic">📞 {order.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
               <p className="text-gray-400 font-black uppercase tracking-widest">No orders found in {activeTab}</p>
            </div>
          )}
        </div>

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-6 py-3 rounded-xl bg-white border border-gray-100 text-xs font-black disabled:opacity-30"
            >
              PREVIOUS
            </button>
            <span className="text-sm font-black text-cake-gold">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-6 py-3 rounded-xl bg-white border border-gray-100 text-xs font-black disabled:opacity-30"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}