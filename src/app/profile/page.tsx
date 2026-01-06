"use client";
import { useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { 
  Calendar, ShoppingBag, Weight as WeightIcon, 
  Clock, Filter, Search, ReceiptText, X, Truck,
  ChevronLeft, ChevronRight, MapPin, MapPinned, Trash2, LogOut, Plus,
  CheckCircle2,
  PackageCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session }: any = useSession();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({ fullAddress: "", pincode: "", phone: "", label: "Home" });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (session) {
      fetch("/api/user/profile").then(res => res.json()).then(json => setUser(json.data));
      fetch("/api/user/orders").then(res => res.json()).then(json => setOrders(json.data));
    }
  }, [session]);

  // --- Address Functions ---
  const addAddress = async () => {
    if (!user) return;
    const updatedAddresses = [...(user.addresses || []), newAddr];
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: updatedAddresses, availablePhone: newAddr.phone }),
    });
    if (res.ok) {
      const json = await res.json();
      setUser(json.data);
      setIsAdding(false);
      setNewAddr({ fullAddress: "", pincode: "", phone: "", label: "Home" });
    }
  };

  const deleteAddress = async (index: number) => {
    const updatedAddresses = user.addresses.filter((_: any, i: number) => i !== index);
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: updatedAddresses }),
    });
    setUser({ ...user, addresses: updatedAddresses });
  };

  // --- Filter & Pagination Logic ---
  const filteredOrders = useMemo(() => {
    let result = orders;
    const now = new Date();
    if (timeFilter !== "all") {
      result = result.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        const diffMonths = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());
        if (timeFilter === "month") return diffMonths < 1;
        if (timeFilter === "3months") return diffMonths <= 3;
        if (timeFilter === "6months") return diffMonths <= 6;
        return true;
      });
    }
    if (searchTerm) {
      result = result.filter((o: any) => o._id.toLowerCase().includes(searchTerm.toLowerCase()) || o.items.some((i: any) => i.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    return result;
  }, [orders, timeFilter, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!user) return <div className="min-h-screen flex items-center justify-center font-serif italic text-cake-gold">Loading Sanctuary...</div>;

  return (
    <div className="min-h-screen bg-[#fffcf9] pt-28 pb-20 px-6 font-sans text-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* --- LEFT SIDEBAR (Sticky) --- */}
        <aside className="lg:w-1/3 space-y-8 lg:sticky lg:top-28 lg:h-fit">
          {/* Profile Details */}
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-cake-gold/40" />
            <div className="w-20 h-20 bg-black text-cake-gold rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4 border-4 border-white shadow-xl">{user.name.charAt(0)}</div>
            <h2 className="text-xl font-black">{user.name}</h2>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1 mb-6">{user.email}</p>
            <button onClick={() => signOut()} className="inline-flex items-center gap-2 text-[9px] font-black uppercase text-red-400 hover:text-red-500 transition-colors"><LogOut size={12} /> Sign Out</button>
          </div>

          {/* Address Management Section */}
          <div className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-gray-400 flex items-center gap-2"><MapPinned size={14}/> Saved Locations</h3>
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {user.addresses?.map((addr: any, idx: number) => (
                  <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-gray-50 rounded-3xl relative group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[8px] font-black uppercase bg-black text-white px-3 py-0.5 rounded-full">{addr.label}</span>
                      <button onClick={() => deleteAddress(idx)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                    </div>
                    <p className="text-[11px] font-bold leading-tight">{addr.fullAddress}</p>
                    <p className="text-[9px] text-gray-400 mt-1 font-bold">PIN {addr.pincode}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Address Form */}
            {!isAdding ? (
              <button onClick={() => setIsAdding(true)} className="w-full py-4 border-2 border-dashed border-gray-100 rounded-3xl text-[9px] font-black uppercase text-gray-400 hover:border-cake-gold hover:text-cake-gold transition-all">+ Add New Address</button>
            ) : (
              <div className="space-y-3 p-4 bg-gray-50 rounded-3xl">
                <input placeholder="Full Address" className="w-full p-3 bg-white rounded-xl text-xs font-bold outline-none border border-gray-100" value={newAddr.fullAddress} onChange={e => setNewAddr({...newAddr, fullAddress: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Pincode" className="p-3 bg-white rounded-xl text-xs font-bold outline-none border border-gray-100" maxLength={6} value={newAddr.pincode} onChange={e => setNewAddr({...newAddr, pincode: e.target.value})} />
                  <input placeholder="Phone" className="p-3 bg-white rounded-xl text-xs font-bold outline-none border border-gray-100" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <button onClick={addAddress} className="flex-1 bg-black text-white py-2.5 rounded-xl text-[9px] font-black uppercase">Save</button>
                  <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-gray-500 py-2.5 rounded-xl text-[9px] font-black uppercase">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Time Filters */}
          <div className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-gray-400 flex items-center gap-2"><Filter size={14}/> Timeline</h3>
            <div className="space-y-2">
              {[ { label: "Past Month", val: "month" }, { label: "Past 6 Months", val: "6months" }, { label: "All Time", val: "all" } ].map((t) => (
                <button key={t.val} onClick={() => setTimeFilter(t.val)} className={`w-full text-left px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${timeFilter === t.val ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>{t.label}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* --- RIGHT CONTENT: ORDERS --- */}
        <main className="lg:w-2/3 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-4xl font-serif font-black italic">Order Journal</h3>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" placeholder="Search orders..." className="pl-12 pr-6 py-4 bg-white rounded-full border border-gray-100 shadow-sm outline-none text-xs font-bold w-full md:w-72" onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {currentOrders.length === 0 ? (
                <div className="bg-white py-24 rounded-[4rem] text-center border-2 border-dashed border-gray-100 text-gray-300 font-bold uppercase text-[10px]">No orders found</div>
              ) : (
                currentOrders.map((order: any) => (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={order._id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                    <div className="p-6 bg-gray-50/50 flex justify-between items-center border-b border-gray-50">
                      <div className="flex gap-6">
                        <div><p className="text-[8px] font-black text-gray-400 uppercase">Placed</p><p className="text-[10px] font-black">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                        <div className="bg-white px-4 py-1.5 rounded-xl border border-cake-gold/20"><p className="text-[8px] font-black text-cake-gold uppercase">Delivery</p><p className="text-[10px] font-black">{order.deliveryDate}</p></div>
                      </div>
                      <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase ${order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-black text-white'}`}>{order.status}</span>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                    
      <div className="flex flex-wrap gap-3">
  {order.items.map((it: any, i: number) => (
    <div 
      key={i} 
      className="flex items-center gap-3 bg-gray-50 pr-4 pl-1 py-1 rounded-full border border-gray-100 hover:border-cake-gold/30 transition-all group"
    >
      {/* Small Circular Image */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
        {it.image ? (
          <img 
            src={it.image} 
            alt={it.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
          />
        ) : (
          <div className="w-full h-full bg-black text-cake-gold flex items-center justify-center text-[10px] font-black uppercase">
            {it.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name and Quantity Info */}
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-black leading-none truncate max-w-[100px]">
          {it.name}
        </span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
          Qty: {it.quantity} • {it.weight}{it.unit}
        </span>
      </div>
      
    </div>
  ))}
</div>
                      <button onClick={() => setSelectedOrder(order)} className="bg-black text-white px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-cake-gold transition-all shadow-lg">View Summary</button>
                    </div>
                    <div className="px-10 py-8 bg-gray-50/30">
  <div className="flex justify-between items-center mb-6">
    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
      <PackageCheck size={14} className="text-cake-gold" /> Tracking Masterpiece
    </p>
    <p className="text-[10px] font-black text-black bg-white px-4 py-1 rounded-full border border-gray-100 shadow-sm">
      ID: #{order._id.slice(-6).toUpperCase()}
    </p>
  </div>

  <div className="relative">
    {/* --- Background Line --- */}
    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
    
    {/* --- Active Progress Line --- */}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ 
        width: 
          order.status === 'Pending' ? '0%' : 
          order.status === 'Processing' ? '33.33%' : 
          order.status === 'Shipped' ? '66.66%' : '100%' 
      }}
      transition={{ duration: 1.5, ease: "circOut" }}
      className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full z-10 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
    />

    {/* --- Steps (Dots) --- */}
    <div className="relative z-20 flex justify-between">
      {[
        { label: 'Received', status: 'Pending' },
        { label: 'Baking', status: 'Processing' },
        { label: 'On Way', status: 'Shipped' },
        { label: 'Arrived', status: 'Delivered' }
      ].map((step, index) => {
        const isCompleted = 
          (order.status === 'Processing' && index <= 1) ||
          (order.status === 'Shipped' && index <= 2) ||
          (order.status === 'Delivered' && index <= 3) ||
          (order.status === 'Pending' && index === 0);

        return (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${
              isCompleted 
              ? 'bg-black border-white text-cake-gold scale-110' 
              : 'bg-white border-gray-100 text-gray-200'
            }`}>
              {isCompleted ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-tighter mt-3 transition-colors duration-500 ${
              isCompleted ? 'text-black' : 'text-gray-300'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
</div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 pt-6">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white rounded-full shadow-sm hover:bg-cake-gold disabled:opacity-20 transition-all"><ChevronLeft size={16}/></button>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{currentPage} / {totalPages}</p>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white rounded-full shadow-sm hover:bg-cake-gold disabled:opacity-20 transition-all"><ChevronRight size={16}/></button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- SUMMARY MODAL --- */}
  <AnimatePresence>
  {selectedOrder && (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-8 text-gray-400 hover:text-black transition-transform hover:rotate-90 z-10"><X size={24}/></button>
        
        <div className="p-10 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-serif font-black italic">Detailed Invoice</h2>
            {/* --- Dynamic Status Badge --- */}
            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-black text-white'
            }`}>
              {selectedOrder.status}
            </span>
          </div>

          {/* --- Mini Status Tracker Bar --- */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
            <div className="flex justify-between items-center text-[8px] font-black uppercase text-gray-400 tracking-widest px-1">
              <span className={selectedOrder.status === 'Pending' ? 'text-cake-gold' : ''}>Received</span>
              <span className={selectedOrder.status === 'Processing' ? 'text-cake-gold' : ''}>Baking</span>
              <span className={selectedOrder.status === 'Shipped' ? 'text-cake-gold' : ''}>On Way</span>
              <span className={selectedOrder.status === 'Delivered' ? 'text-cake-gold' : ''}>Arrived</span>
            </div>
            <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ 
                  width: 
                    selectedOrder.status === 'Pending' ? '15%' : 
                    selectedOrder.status === 'Processing' ? '40%' : 
                    selectedOrder.status === 'Shipped' ? '75%' : '100%' 
                }}
                className="h-full bg-black"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex gap-4">
            <MapPin className="text-cake-gold shrink-0" size={18}/>
            <div>
              <p className="text-[9px] font-black uppercase text-gray-400">Ship To</p>
              <p className="text-[11px] font-bold text-black mt-1 leading-tight">{selectedOrder.address}, {selectedOrder.pincode}</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedOrder.items.map((it: any, i: number) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div className="flex gap-3 items-center">
                  <img src={it.image} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-[11px] font-black text-black">{it.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{it.weight}{it.unit} x {it.quantity}</p>
                  </div>
                </div>
                <p className="text-[11px] font-black">₹{it.price * it.quantity}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111] text-white p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5"><ReceiptText size={100}/></div>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400"><span>Subtotal</span><span>₹{selectedOrder.totalAmount}</span></div>
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400"><span>Delivery Charge</span><span className="text-green-400">FREE</span></div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div><p className="text-[8px] font-black text-cake-gold uppercase mb-1">Total Indulgence</p><p className="text-4xl font-serif italic tracking-tighter">₹{selectedOrder.totalAmount}</p></div>
                <p className="text-[8px] font-black text-gray-500 uppercase">Paid: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
}