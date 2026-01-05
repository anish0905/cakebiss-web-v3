"use client";
import { useEffect, useState } from "react";
import { 
  Download, Phone, Calendar, Gift, MessageCircle, 
  MessageSquareText, ArrowLeft, MapPin, ShoppingBag, Filter 
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState(""); // Date Filter State
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const json = await res.json();
    if (json.success) setOrders(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- Common Message Generator ---
  const getStatusMessage = (order: any) => {
    const itemsList = order.items.map((i: any) => `• ${i.name} (x${i.quantity})`).join('\n');
    let statusUpdate = "";
    if (order.status === 'Processing') statusUpdate = "kitchen mein fresh bake ho raha hai. 🥣✨";
    else if (order.status === 'Shipped') statusUpdate = "delivery ke liye nikal chuka hai. 🚚💨";
    else if (order.status === 'Delivered') statusUpdate = "deliver ho gaya hai. Feedback zaroor share karein! 🍰❤️";
    else statusUpdate = "par kaam chal raha hai.";

    return `CakeBiss Order #${order._id.slice(-6)}\nItems:\n${itemsList}\n\nUpdate: Aapka order ${statusUpdate}`;
  };

  const sendWhatsApp = (order: any) => {
    const phoneNumber = order.phone.replace(/\D/g, ''); 
    window.open(`https://wa.me/91${phoneNumber}?text=${encodeURIComponent(getStatusMessage(order))}`, '_blank');
  };

  const sendSMS = (order: any) => {
    const phoneNumber = order.phone.replace(/\D/g, '');
    window.open(`sms:+91${phoneNumber}?body=${encodeURIComponent(getStatusMessage(order))}`, '_blank');
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchOrders();
  };

  // --- Logic: Filtering by Status & Date ---
  const filteredOrders = orders.filter((o: any) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesDate = filterDate === "" || o.deliveryDate === filterDate;
    return matchesTab && matchesDate;
  });

  // --- Logic: Pagination ---
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Processing': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-900 border-green-200';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-xs tracking-widest">SYNCING VAULT...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#f8f8f8] min-h-screen font-sans text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Global Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
          <div className="space-y-2">
            <Link href="/admin" className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-black italic">Orders Vault</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm flex-1 lg:flex-none">
              <Calendar size={18} className="ml-2 text-gray-400" />
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => {setFilterDate(e.target.value); setCurrentPage(1);}}
                className="bg-transparent outline-none text-xs font-black uppercase cursor-pointer"
              />
              {filterDate && <button onClick={() => setFilterDate("")} className="text-[10px] font-black text-red-500 pr-2">RESET</button>}
            </div>
            <div className="bg-black text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3">
              <ShoppingBag size={20} className="text-cake-gold" />
              <span className="text-xl font-black">{filteredOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-black text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="space-y-6">
          {currentOrders.length > 0 ? currentOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8">
                
                {/* 1. Items & Status */}
                <div className="flex-[1.2] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">#{order._id.slice(-8)}</span>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)} 
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 outline-none ${getStatusColor(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm font-black mb-2 last:mb-0">
                        <span>{item.name} <span className="text-cake-gold ml-1">x{item.quantity}</span></span>
                        <span className="opacity-30 italic">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                       <p className="text-[10px] font-black uppercase text-gray-400">Total Amount</p>
                       <p className="text-2xl font-black italic">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customization (Message & Occasion) */}
                <div className="flex-1 bg-cake-cream/10 p-8 rounded-[2rem] border border-cake-gold/5 flex flex-col">
                   <p className="text-[10px] font-black uppercase text-cake-gold mb-4 tracking-widest underline decoration-2 underline-offset-4">Event Details</p>
                   <div className="space-y-3 font-black text-xs flex-1">
                      <p className="flex items-center gap-2">📅 Delivery: {order.deliveryDate}</p>
                      <p className="flex items-center gap-2">🎈 Occasion: {order.occasion}</p>
                      <div className="mt-4 p-4 bg-white/80 rounded-2xl border border-cake-gold/10 text-stone-600 leading-relaxed italic">
                        "{order.cakeMessage || "No message provided"}"
                      </div>
                   </div>
                </div>

                {/* 3. Address & Communication */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin size={12}/> Shipment To</h4>
                    <p className="text-xs font-black leading-tight text-gray-700">{order.address}</p>
                    <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded mt-2 inline-block">PIN: {order.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-6 border-t">
                    <a href={`tel:${order.phone}`} className="flex-1 h-14 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 hover:bg-black hover:text-white transition-all"><Phone size={18} /></a>
                    <button onClick={() => sendWhatsApp(order)} className="w-14 h-14 flex items-center justify-center bg-green-500 text-white rounded-2xl shadow-lg shadow-green-100 hover:scale-105 transition-all"><MessageCircle size={22} /></button>
                    <button onClick={() => sendSMS(order)} className="w-14 h-14 flex items-center justify-center bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-100 hover:scale-105 transition-all"><MessageSquareText size={22} /></button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
               <p className="text-gray-300 font-black uppercase tracking-[0.4em]">No Orders Found</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pb-12">
            <button 
              disabled={currentPage === 1} 
              onClick={() => {setCurrentPage(p => p - 1); window.scrollTo({top: 0, behavior: 'smooth'});}}
              className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all"
            >
              Previous
            </button>
            <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 text-xs font-black">
              {currentPage} / {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => {setCurrentPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'});}}
              className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}