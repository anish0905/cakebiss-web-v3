"use client";
import { useCartStore } from "../../store/useCartStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { useSession, signIn } from "next-auth/react"; // 1. Import Session hooks

export default function CartPage() {
  const { data: session, status } = useSession(); // 2. Get Login status
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  
  const total = cart.reduce((acc, item) => {
    const finalPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffcf9] px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShoppingBag size={80} className="text-gray-200 mb-6 mx-auto" />
          <h2 className="text-4xl font-serif italic text-black mb-4">Your boutique bag is empty</h2>
          <Link href="/cakes" className="bg-black text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-cake-gold transition-all">
            Return to Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- LEFT: CART ITEMS LIST --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="border-b border-gray-100 pb-8">
            <h1 className="text-5xl font-serif font-black italic text-black leading-none">Your Selection</h1>
            <p className="mt-4 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Items curated for your celebration</p>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => {
                const finalPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                  <motion.div 
                    layout
                    key={item._id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative group"
                  >
                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-3xl shadow-md" />
                    
                    <div className="flex-grow text-center sm:text-left space-y-1">
                      <h3 className="text-xl font-serif font-black italic text-black">{item.name}</h3>
                      <p className="text-[10px] font-bold text-cake-gold uppercase tracking-widest">{item.category} • {item.weight}{item.unit}</p>
                      <div className="pt-2">
                        <span className="text-sm font-black">₹{finalPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-2xl p-2 gap-4">
                      <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all"><Minus size={14} /></button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all"><Plus size={14} /></button>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[100px]">
                      <span className="text-xl font-black text-black">₹{finalPrice * item.quantity}</span>
                      <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT: ORDER SUMMARY (Login Logic Included) --- */}
        <div className="lg:col-span-1">
          <div className="bg-black text-white p-10 rounded-[3rem] sticky top-32 shadow-2xl space-y-8">
            <h2 className="text-2xl font-serif italic border-b border-white/10 pb-6">Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                <span>Delivery</span>
                <span className="text-cake-gold font-bold">FREE</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Grand Total</p>
                <p className="text-4xl font-black text-cake-gold tracking-tighter">₹{total}</p>
              </div>
            </div>

            {/* --- 3. Conditional Button Logic --- */}
            {status === "authenticated" ? (
              <Link 
                href="/checkout" 
                className="w-full bg-cake-gold text-black py-6 rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => signIn()} 
                  className="w-full bg-white text-black py-6 rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-cake-gold transition-all shadow-xl"
                >
                  <Lock size={16} /> Login to Checkout
                </button>
                <p className="text-[9px] text-center text-gray-500 font-bold uppercase tracking-widest">
                  Authentication required for secure ordering
                </p>
              </div>
            )}

            <div className="text-center pt-4 opacity-50">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">SSL Encrypted Gateway</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}