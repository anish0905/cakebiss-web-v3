"use client";
import { useCartStore } from "../../store/useCartStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Leaf } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  
  // Total calculation with prioritised discount price
  const total = cart.reduce((acc, item) => {
    const priceToUse = item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + priceToUse * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <ShoppingBag size={32} className="text-[#ff4d6d]" />
          </div>
          <h2 className="text-4xl font-serif italic mb-6">Your bag is empty</h2>
          <Link href="/cakes" className="bg-[#ff4d6d] text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all inline-block">
            Start Selection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-10 text-white font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: CART ITEMS (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-6">
          <header className="border-b border-white/5 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Cart</h1>
              <p className="mt-2 text-gray-500 font-bold uppercase text-[9px] tracking-[0.3em]">Review your luxury desserts</p>
            </div>
            <span className="text-[10px] font-black text-[#ff4d6d] uppercase">{cart.length} Models</span>
          </header>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => {
                const itemSinglePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                  <motion.div 
                    layout 
                    key={`${item._id}-${item.weight}`} // Unique key for variants
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col md:flex-row items-center gap-6 bg-white/5 p-4 rounded-[2rem] border border-white/5 hover:border-[#ff4d6d20] transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-black">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                      {item.isEggless && (
                        <div className="absolute top-1.5 left-1.5 bg-green-500 p-1 rounded-full">
                          <Leaf size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-lg font-bold uppercase tracking-tight">{item.name}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.flavor}</span>
                        <span className="text-[#ff4d6d] text-[9px] font-black uppercase px-2 py-0.5 bg-[#ff4d6d10] rounded-md">
                          {item.weight} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Control - FIXED ARGS */}
                    <div className="flex items-center bg-black/50 rounded-xl p-1 border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item._id, item.weight, Math.max(1, item.quantity - 1))} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-black text-xs w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.weight, item.quantity + 1)} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price & Remove - FIXED ARGS */}
                    <div className="flex items-center gap-6 min-w-[140px] justify-end">
                      <div className="text-right">
                        <p className="text-xl font-black text-white">₹{itemSinglePrice * item.quantity}</p>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">₹{itemSinglePrice} / unit</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id, item.weight)} 
                        className="text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT: SUMMARY (4 Cols) --- */}
        <div className="lg:col-span-4">
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] sticky top-32 border border-white/5 shadow-2xl space-y-8">
            <h2 className="text-xl font-serif italic border-b border-white/5 pb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Vat / Gst</span>
                <span className="text-white font-bold">₹0</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-green-500">
                <span>Delivery</span>
                <span className="font-bold uppercase">Free</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[9px] font-bold uppercase text-gray-600 mb-1">Total Due</p>
              <p className="text-5xl font-black text-[#ff4d6d] tracking-tighter">₹{total}</p>
            </div>

            {/* Checkout Logic */}
            <div className="space-y-3 pt-4">
              {status === "authenticated" ? (
                <Link 
                  href="/checkout" 
                  className="w-full bg-[#ff4d6d] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_10px_20px_#ff4d6d30]"
                >
                  Confirm Order <ArrowRight size={14} />
                </Link>
              ) : (
                <button 
                  onClick={() => signIn()} 
                  className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#ff4d6d] hover:text-white transition-all shadow-xl"
                >
                  <Lock size={12} /> Sign In to Buy
                </button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}