"use client";
import { useEffect, useState } from "react";
import { Download, Phone, Calendar, Gift, MessageCircle, ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import Link from "next/link";

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
      alert(`Status updated to ${newStatus}`);
      fetchOrders();
    }
  };

  // --- WhatsApp Automation ---
  const sendWhatsApp = (order: any) => {
    const phoneNumber = order.phone.replace(/\D/g, ''); 
    const itemsList = order.items.map((i: any) => `- ${i.name} (x${i.quantity})`).join('\n');
    let message = `*CakeBiss Artisanal Patisserie* 🎂\n\n`;
    message += `*Order:* #${order._id.slice(-6)}\n`;
    message += `*Items:*\n${itemsList}\n\n`;

    if (order.status === 'Processing') {
      message += `Hi! Aapka order kitchen mein fresh bake ho raha hai. 🥣✨`;
    } else if (order.status === 'Shipped') {
      message += `Khushkhabri! Aapka order delivery ke liye nikal chuka hai. 🚚💨`;
    } else if (order.status === 'Delivered') {
      message += `Aapka order deliver ho gaya hai. Feedback zaroor share karein! 🍰❤️`;
    }

    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- Bill Generation ---
  const generateBill = (order: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55);
    doc.text("CakeBiss Artisanal Patisserie", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice: #${order._id}`, 14, 28);
    
    const tableRows = order.items.map((item: any) => [
      item.name, item.quantity, `Rs. ${item.price}`, `Rs. ${item.price * item.quantity}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Cake Name', 'Qty', 'Price', 'Total']],
      body: tableRows,
      headStyles: { fillColor: [0, 0, 0] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 140, finalY, { align: "right" });
    doc.save(`Invoice_${order._id.slice(-6)}.pdf`);
  };

  const filteredOrders = activeTab === "All" ? orders : orders.filter((o: any) => o.status === activeTab);
  const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Processing': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-900 border-green-200';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">Syncing Boutique...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#f8f8f8] min-h-screen font-sans text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-2">
            <Link href="/admin" className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-black italic">Orders Vault</h1>
          </div>
          <div className="bg-black text-white px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
            <ShoppingBag className="text-cake-gold" />
            <div>
               <p className="text-[9px] font-black uppercase opacity-50 tracking-widest leading-none">Total {activeTab}</p>
               <span className="text-2xl font-black leading-none">{filteredOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-black text-white shadow-xl scale-105" : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="space-y-8">
          {currentOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
                
                {/* 1. Items Section (Updated) */}
                <div className="flex-[1.2] space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-300 uppercase">#{order._id.slice(-8)}</span>
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
                  
                  {/* Items List Table-like UI */}
                  <div className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                    <h4 className="text-[9px] font-black uppercase text-gray-400 mb-4 tracking-widest">Ordered Masterpieces</h4>
                    <div className="space-y-3">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center group/item">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black">
                              {item.quantity}x
                            </div>
                            <span className="text-sm font-black text-black group-hover/item:text-cake-gold transition-colors">{item.name}</span>
                          </div>
                          <span className="text-sm font-black opacity-40 italic">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end">
                       <p className="text-[10px] font-black uppercase text-gray-400">Total Paid</p>
                       <p className="text-3xl font-black italic tracking-tighter text-black">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customization Section */}
                <div className="flex-1 bg-cake-cream/10 p-8 rounded-[2.5rem] border border-cake-gold/5 space-y-4">
                  <p className="text-[10px] font-black uppercase text-cake-gold tracking-widest">Personalization</p>
                  <div className="space-y-3 font-bold text-sm">
                    <p className="flex items-center gap-3"><Calendar size={16}/> {order.deliveryDate}</p>
                    <p className="flex items-center gap-3"><Gift size={16}/> {order.occasion}</p>
                    <div className="mt-4 p-4 bg-white rounded-2xl shadow-inner italic text-xs text-stone-600 border border-gray-50 leading-relaxed">
                      "{order.cakeMessage || "No message"}"
                    </div>
                  </div>
                  <button onClick={() => generateBill(order)} className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-black hover:text-white transition-all shadow-sm">
                    <Download size={14} /> Get Invoice
                  </button>
                </div>

                {/* 3. Shipping & WhatsApp */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <MapPin size={12}/> Delivery Address
                    </h4>
                    <p className="text-sm font-black leading-snug">{order.address}</p>
                    <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-md mt-2 inline-block">PIN: {order.pincode}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                    <a href={`tel:${order.phone}`} className="flex-1 h-16 flex items-center justify-center gap-3 bg-gray-50 rounded-[1.5rem] font-black text-sm hover:bg-black hover:text-white transition-all border border-gray-100">
                      <Phone size={18} /> Call
                    </a>
                    <button 
                      onClick={() => sendWhatsApp(order)}
                      className="h-16 w-16 flex items-center justify-center bg-green-500 text-white rounded-[1.5rem] hover:bg-green-600 transition-all shadow-xl shadow-green-200"
                    >
                      <MessageCircle size={28} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16 pb-10">
            <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="px-10 py-5 rounded-[2rem] bg-black text-white text-[10px] font-black tracking-widest shadow-2xl disabled:opacity-20">PREVIOUS</button>
            <span className="font-black text-xs">{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="px-10 py-5 rounded-[2rem] bg-black text-white text-[10px] font-black tracking-widest shadow-2xl disabled:opacity-20">NEXT</button>
          </div>
        )}
      </div>
    </div>
  );
}