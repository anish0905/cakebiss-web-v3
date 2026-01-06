"use client";
import { useEffect, useState } from "react";
import { 
  Download, Phone, Calendar, ShoppingBag, ArrowLeft, 
  MapPin, MessageCircle, MessageSquareText, FileText, 
  Gift,
  Clock,
  Info
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const json = await res.json();
    if (json.success) setOrders(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- PDF BILL GENERATOR LOGIC ---
  const generateBill = (order: any) => {
    const doc = new jsPDF();
    
    // Header - Brand Name
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55); // Cake Gold Color
    doc.text("CAKEBISS PATISSERIE", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Artisanal Handcrafted Cakes • Premium Quality", 105, 27, { align: "center" });

    // Order Info
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`INVOICE: #ORD-${order._id.slice(-6).toUpperCase()}`, 14, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, 45, { align: "right" });

    // Customer Details
    doc.setFontSize(10);
    doc.text("SHIP TO:", 14, 55);
    doc.setFont("helvetica", "bold");
    doc.text(order.user?.name || "Customer", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.address}`, 14, 65, { maxWidth: 80 });
    doc.text(`PIN: ${order.pincode}`, 14, 75);
    doc.text(`Phone: +91 ${order.phone}`, 14, 80);

    // Occasion Details
    doc.text(`Event: ${order.occasion}`, 196, 60, { align: "right" });
    doc.text(`Delivery Date: ${order.deliveryDate}`, 196, 65, { align: "right" });

    // Table
    const tableData = order.items.map((item: any) => [
      item.name,
      `${item.weight || '0.5'}${item.unit || 'kg'}`,
      item.quantity,
      `INR ${item.price}`,
      `INR ${item.price * item.quantity}`
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Masterpiece", "Weight", "Qty", "Rate", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: { 4: { halign: "right" } }
    });

    // Total Amount
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`GRAND TOTAL: INR ${order.totalAmount}`, 196, finalY + 15, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing CakeBiss! Share your sweet moment with us.", 105, 280, { align: "center" });

    doc.save(`CakeBiss_Order_${order._id.slice(-6)}.pdf`);
  };

  // --- WhatsApp & SMS Messages ---
  const getStatusMessage = (order: any) => {
    const itemsList = order.items.map((i: any) => `• ${i.name}`).join('\n');
    return `CakeBiss Order #${order._id.slice(-6)}\nUpdate: Aapka order abhi ${order.status} status par hai.\n\nItems:\n${itemsList}\nTotal: ₹${order.totalAmount}`;
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchOrders();
  };

  const filteredOrders = orders.filter((o: any) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesDate = filterDate === "" || o.deliveryDate === filterDate;
    return matchesTab && matchesDate;
  });

  const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white tracking-[0.5em] animate-pulse">VAULT_SYNCING...</div>;

  return (
    <div className="p-6 md:p-12 bg-[#fafafa] min-h-screen font-sans text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="space-y-3">
            <Link href="/admin" className="text-gray-400 hover:text-black transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Hub
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter text-black">Master List</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <Calendar size={18} className="text-cake-gold" />
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="outline-none text-xs font-black uppercase" />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-10">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button key={tab} onClick={() => {setActiveTab(tab); setCurrentPage(1);}} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-black text-white shadow-2xl scale-105" : "bg-white text-gray-400"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8">
          {currentOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[3.5rem] p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500">
              
              {/* Order Meta & Status */}
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-300 tracking-[0.3em]">#{order._id.slice(-8).toUpperCase()}</span>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)} 
                    className="bg-gray-50 border-none rounded-full px-6 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="flex gap-8">
          {/* Order Received Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
              <Clock size={14} />
            </div>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Order Received</p>
              <p className="text-[11px] font-black text-black">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Delivery Deadline Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cake-gold/10 flex items-center justify-center text-cake-gold shadow-sm">
              <Calendar size={14} />
            </div>
            <div>
              <p className="text-[8px] font-black text-cake-gold uppercase tracking-widest">Delivery Deadline</p>
              <p className="text-[11px] font-black text-black underline underline-offset-4 decoration-cake-gold/30">
                {order.deliveryDate}
              </p>
            </div>
          </div>
        </div>
                
                <div className="space-y-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <img src={item.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                      <div className="flex-grow">
                        <p className="text-sm font-black">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.weight || 0.5}kg • x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                   <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Revenue</p>
                     <p className="text-3xl font-black italic">₹{order.totalAmount}</p>
                   </div>
                   {/* PDF BILL BUTTON */}
                   <button 
                     onClick={() => generateBill(order)}
                     className="bg-black text-white p-4 rounded-2xl hover:bg-cake-gold hover:text-black transition-all shadow-xl group/btn flex items-center gap-2"
                   >
                     <FileText size={18} />
                     <span className="text-[9px] font-black uppercase">Bill</span>
                   </button>
                </div>
              </div>

              {/* Event & Message */}
            {/* --- 2. LUXURY CUSTOMIZATION SECTION --- */}
<div className="flex-1 bg-gradient-to-br from-[#fff9f0] to-[#f7f0e6] p-8 rounded-[3rem] border border-cake-gold/10 flex flex-col relative overflow-hidden shadow-inner group">
  
  {/* Decorative Background Icon */}
  <div className="absolute -top-6 -right-6 text-cake-gold/10 rotate-12 transition-transform group-hover:rotate-45 duration-700">
    <Gift size={160} />
  </div>

  <div className="relative z-10 flex flex-col h-full">
    {/* Section Title with Icon */}
    <div className="flex items-center gap-2 mb-6 border-b border-cake-gold/10 pb-4">
      <MessageSquareText size={16} className="text-cake-gold" />
      <p className="text-[10px] font-black uppercase text-cake-gold tracking-[0.3em]">Artisan Instructions</p>
    </div>

    {/* Occasion Pill */}
    <div className="mb-4">
       <span className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
         <span className="animate-pulse">🎈</span> {order.occasion}
       </span>
    </div>

    {/* Cake Message Card (Chef's Handwriting Style) */}
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm flex-grow flex flex-col justify-center relative">
       {/* Small Quote Mark Decor */}
       <div className="absolute top-4 left-4 text-cake-gold/20 text-4xl font-serif">“</div>
       
       <p className="text-sm font-serif italic text-stone-700 leading-relaxed text-center px-4">
         {order.cakeMessage ? order.cakeMessage : "No special message requested."}
       </p>
       
       <div className="absolute bottom-4 right-4 text-cake-gold/20 text-4xl font-serif">”</div>
    </div>

    {/* Extra Instructions Note */}
    {order.instructions && (
      <div className="mt-4 flex items-start gap-2 px-2">
        <Info size={12} className="text-cake-gold shrink-0 mt-1" />
        <p className="text-[10px] font-bold text-stone-500 italic leading-tight">
          Note: {order.instructions}
        </p>
      </div>
    )}
  </div>
</div>

              {/* Delivery & Contact */}
              <div className="flex-1 space-y-8 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12} /> Destination</p>
                  <p className="text-sm font-black leading-relaxed text-gray-800">{order.address}</p>
                  <p className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full inline-block mt-3">PIN: {order.pincode}</p>
                </div>

                <div className="flex gap-3">
                  <a href={`tel:${order.phone}`} className="flex-1 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Phone size={20}/></a>
                  <button onClick={() => window.open(`https://wa.me/91${order.phone}?text=${encodeURIComponent(getStatusMessage(order))}`)} className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100"><MessageCircle size={24}/></button>
                  <button onClick={() => window.open(`sms:+91${order.phone}?body=${encodeURIComponent(getStatusMessage(order))}`)} className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100"><MessageSquareText size={24}/></button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}