"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session }: any = useSession();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [newAddr, setNewAddr] = useState({ 
    fullAddress: "", 
    pincode: "", 
    phone: "", 
    label: "Home" 
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/user/profile").then(res => res.json()).then(json => setUser(json.data));
      fetch("/api/user/orders").then(res => res.json()).then(json => setOrders(json.data));
    }
  }, [session]);

  const addAddress = async () => {
    if (!user) return;
    
    if (!newAddr.phone || newAddr.phone.length < 10) {
      return alert("Please enter a valid 10-digit phone number");
    }
    if (!newAddr.fullAddress.trim() || newAddr.pincode.length !== 6) {
      return alert("Please fill address and 6-digit pincode correctly");
    }

    const updatedAddresses = [...(user.addresses || []), newAddr];

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        addresses: updatedAddresses,
        availablePhone: newAddr.phone 
      }),
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

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffdfa]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cake-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf9] py-12 px-4 md:px-12 text-black font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-black italic">My Sanctuary</h1>
          <p className="text-gray-500 font-medium mt-2">Manage your luxury experience and track sweet deliveries.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: User & Address Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-black">{user.name}</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{user.email}</p>
              {user.availablePhone && (
                <p className="mt-2 text-xs font-bold text-cake-gold">Primary: {user.availablePhone}</p>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b pb-4">Saved Addresses</h3>
              
              <div className="space-y-4">
                {user.addresses?.map((addr: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-3xl relative group border border-transparent hover:border-cake-gold transition-all">
                    <span className="text-[9px] font-black uppercase bg-black text-white px-3 py-1 rounded-full mb-2 inline-block">
                      {addr.label}
                    </span>
                    <p className="text-sm font-black leading-tight mb-2">{addr.fullAddress}</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <span className="text-cake-gold">📍</span> {addr.pincode}
                      </p>
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <span className="text-cake-gold">📞</span> {addr.phone}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteAddress(index)}
                      className="absolute top-4 right-4 text-[10px] font-black text-red-500 opacity-0 group-hover:opacity-100 transition-all uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add New Address Logic */}
                {(!user.addresses || user.addresses.length < 3) && (
                  <div className="mt-6">
                    {!isAdding ? (
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-cake-gold hover:text-cake-gold transition-all"
                      >
                        + Add New Address
                      </button>
                    ) : (
                      <div className="space-y-3 p-5 bg-cake-cream/20 rounded-[2rem] border border-cake-gold/10">
                        <input 
                          placeholder="House No, Street Name" 
                          className="w-full p-3 rounded-xl border-none bg-white text-sm font-bold outline-none shadow-sm"
                          value={newAddr.fullAddress}
                          onChange={(e) => setNewAddr({...newAddr, fullAddress: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            placeholder="Pincode" 
                            maxLength={6}
                            className="p-3 rounded-xl border-none bg-white text-sm font-bold outline-none shadow-sm"
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({...newAddr, pincode: e.target.value})}
                          />
                          <input 
                            placeholder="Phone" 
                            className="p-3 rounded-xl border-none bg-white text-sm font-bold outline-none shadow-sm"
                            value={newAddr.phone}
                            onChange={(e) => setNewAddr({...newAddr, phone: e.target.value})}
                          />
                        </div>
                        <select 
                          className="w-full p-3 rounded-xl border-none bg-white text-sm font-bold outline-none shadow-sm"
                          value={newAddr.label}
                          onChange={(e) => setNewAddr({...newAddr, label: e.target.value})}
                        >
                          <option value="Home">🏠 Home</option>
                          <option value="Work">💼 Work</option>
                          <option value="Other">📍 Other</option>
                        </select>
                        <div className="flex gap-2 pt-2">
                          <button onClick={addAddress} className="flex-1 bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase hover:bg-cake-gold transition-colors shadow-lg">Save</button>
                          <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Order History Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif font-black text-black mb-8 italic">Past Creations & Orders</h3>
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No orders yet</p>
                  <Link href="/cakes" className="text-cake-gold font-black underline mt-4 inline-block uppercase text-[10px]">Shop Now</Link>
                </div>
              ) : (
                orders.map((order: any) => (
                  <div key={order._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Order ID: #{order._id.slice(-6)}</span>
                        <h4 className="text-xl font-black">₹{order.totalAmount}</h4>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-cake-gold/10 text-cake-gold'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {order.items.map((item: any, i: number) => (
                        <span key={i} className="text-[10px] font-bold bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                          {item.name} <span className="text-cake-gold ml-1">x{item.quantity}</span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-1000"
                          style={{ 
                            width: order.status === 'Pending' ? '25%' : 
                                   order.status === 'Processing' ? '50%' : 
                                   order.status === 'Shipped' ? '75%' : '100%' 
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-gray-300 tracking-tighter">
                        <span>Pending</span><span>Cooking</span><span>On Way</span><span>Arrived</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}