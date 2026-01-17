"use client";
import { useState, useEffect } from "react";
import { FREE_DELIVERY_PINCODES, FLAT_DELIVERY_CHARGE } from "../../lib/deliveryConfig";
import { useCartStore } from "../../store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, clearCart }: any = useCartStore();

  const [user, setUser] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [address, setAddress] = useState(""); 
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // Customization States
  const [deliveryDate, setDeliveryDate] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [cakeMessage, setCakeMessage] = useState("");

  const subtotal = cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (session) {
      fetch("/api/user/profile").then((res) => res.json()).then((json) => setUser(json.data));
    }
  }, [session]);

  useEffect(() => {
    if (pincode.length === 6) {
      setDeliveryCharge(FREE_DELIVERY_PINCODES.includes(pincode) ? 0 : FLAT_DELIVERY_CHARGE);
    }
  }, [pincode]);

  const finalTotal = subtotal + deliveryCharge;

 const handleOrder = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1. Login Check: Agar session nahi hai toh alert dikhao aur return kar jao
  if (!session) {
    alert("⚠️ Please Login first to place your order!");
    // Optional: User ko login page par redirect karne ke liye niche wali line uncomment karein
    // router.push("/api/auth/signin"); 
    return;
  }

  const finalAddress = selectedAddress || address;

  // 2. Validation Check
  if (!finalAddress || pincode.length !== 6 || phone.length < 10 || !deliveryDate) {
    alert("Please ensure Address, Pincode, Phone and Delivery Date are filled.");
    return;
  }

  // 3. API Call
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      items: cart, 
      totalAmount: finalTotal, 
      deliveryCharge, 
      address: finalAddress, 
      pincode, 
      phone,
      deliveryDate,
      occasion,
      cakeMessage
    }),
  });

  if (res.ok) {
    alert("🍰 Your sweet order has been placed!");
    clearCart();
    router.push("/profile");
    router.refresh();
  }
};

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/cart" className="text-gray-400 hover:text-black transition-colors">← Back</Link>
        <h1 className="text-4xl font-serif font-black text-black italic">Finalize Order</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Shipping & Customization */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* 1. Address Selection UI */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Where should we deliver?</h2>
              <Link href="/profile" className="text-[10px] font-black uppercase text-cake-gold hover:underline">
                + Manage Addresses
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.addresses?.map((addr: any, idx: number) => {
                const isSelected = selectedAddress === addr.fullAddress;
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(addr.fullAddress);
                      setPincode(addr.pincode);
                      setPhone(addr.phone || "");
                      setAddress(""); 
                    }}
                    className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 ${
                      isSelected 
                      ? 'border-black bg-black text-white shadow-2xl scale-[1.02]' 
                      : 'border-gray-100 bg-gray-50 hover:border-cake-gold text-black'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-cake-gold text-black w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg">
                        ✓
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isSelected ? 'bg-cake-gold text-black' : 'bg-gray-200 text-gray-500'}`}>
                        {addr.label}
                      </span>
                      <Link href="/profile" className={`text-[9px] font-bold uppercase underline ${isSelected ? 'text-gray-400' : 'text-cake-gold'}`}>Edit</Link>
                    </div>
                    <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-black'}`}>{addr.fullAddress}</p>
                    <div className="flex justify-between mt-4 opacity-60 text-[10px] font-bold uppercase">
                       <span>📍 {addr.pincode}</span>
                       <span>📞 {addr.phone}</span>
                    </div>
                  </div>
                );
              })}

              {/* Manual Input Trigger */}
              <div 
                onClick={() => { setSelectedAddress(""); setPincode(""); setPhone(""); }}
                className={`p-6 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${!selectedAddress ? 'border-cake-gold bg-cake-cream/20' : 'border-gray-200 hover:border-cake-gold'}`}
              >
                <span className="text-2xl mb-1">{!selectedAddress ? '✍️' : '➕'}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {!selectedAddress ? 'Using Custom Address' : 'Use Different Address'}
                </p>
              </div>
            </div>

            {!selectedAddress && (
              <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2">
                <textarea 
                  placeholder="Street name, Apartment, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-5 bg-gray-50 border-none rounded-3xl text-sm font-bold outline-none focus:ring-2 focus:ring-cake-gold"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Pincode" value={pincode} maxLength={6} onChange={(e) => setPincode(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-cake-gold" />
                  <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-cake-gold" />
                </div>
              </div>
            )}
          </div>

          {/* 2. Customization Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Customization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="text-[10px] font-black uppercase text-black ml-2 mb-1 block group-focus-within:text-cake-gold transition-colors">Delivery Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-cake-gold transition-all cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-black ml-2 mb-1 block">Special Occasion</label>
                <select 
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-cake-gold transition-all cursor-pointer"
                >
                  <option value="Birthday">Birthday 🎂</option>
                  <option value="Anniversary">Anniversary 💍</option>
                  <option value="Wedding">Wedding 👰</option>
                  <option value="Other">Other Event ✨</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-black ml-2 mb-1 block">Name/Message on Cake</label>
              <input 
                type="text" 
                placeholder="Ex: Happy Birthday Rahul"
                onChange={(e) => setCakeMessage(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-cake-gold transition-all"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl sticky top-28 border border-white/5">
            <h2 className="text-2xl font-serif font-black italic mb-10 text-cake-gold">Summary</h2>
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-sm font-bold opacity-50">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold items-center">
                <span className="opacity-50">Shipping</span>
                <span className={deliveryCharge === 0 && pincode.length === 6 ? "text-green-400" : "text-white"}>
                  {pincode.length === 6 ? (deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`) : "--"}
                </span>
              </div>
              <div className="pt-6 border-t border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Grand Total</p>
                 <span className="text-5xl font-black text-cake-gold tracking-tighter">₹{finalTotal}</span>
              </div>
            </div>

   <button 
  onClick={handleOrder}
  disabled={cart.length === 0}
  className={`w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-[13px] transition-all duration-300 shadow-xl active:scale-95 disabled:opacity-30 
    ${session 
      ? "bg-cake-gold text-black hover:bg-gray-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]" 
      : "bg-[#1a1a1a] text-cake-gold border border-cake-gold/30 hover:bg-black hover:border-cake-gold"
    }`}
>
  {session ? (
    <span className="flex items-center justify-center gap-2 text-white">
       Place Order <span className="text-lg">✨</span>
    </span>
  ) : (
    "Login to Checkout"
  )}
</button>
          </div>
        </div>

      </div>
    </div>
  );
}