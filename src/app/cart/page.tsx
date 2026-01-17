"use client";
import { useCartStore } from "../../store/useCartStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Leaf, CheckCircle } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  
  const total = cart.reduce((acc, item) => {
    const priceToUse = item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + priceToUse * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-6 text-center text-white">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
            <ShoppingBag size={36} className="text-[#ff4d6d]" />
          </div>
          <h2 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">Bag is Empty</h2>
          <p className="text-gray-500 uppercase text-[10px] tracking-[0.4em] mb-10">Start curating your luxury selection</p>
          <Link href="/cakes" className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#ff4d6d] hover:text-white transition-all duration-500 inline-block shadow-xl">
            Go to Gallery
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-10 text-white font-sans selection:bg-[#ff4d6d]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT: ITEMS SECTION (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-8">
          <header className="border-b border-white/5 pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Your <span className="text-[#ff4d6d]">Bag</span></h1>
              <p className="mt-4 text-gray-600 font-bold uppercase text-[9px] tracking-[0.4em]">Handcrafted models ready for delivery</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{cart.length} Items</span>
              <div className="h-1 w-12 bg-[#ff4d6d] mt-1 rounded-full" />
            </div>
          </header>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item: any) => {
                const itemSinglePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                  <motion.div 
                    layout 
                    key={`${item._id}-${item.weight}`}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex flex-col md:flex-row items-center gap-6 bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 shadow-2xl"
                  >
                    {/* Thumbnail with Ribbon */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0 overflow-hidden rounded-[1.5rem] bg-[#111] border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                      {item.isEggless && (
                        <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-md p-1.5 rounded-full shadow-lg">
                          <Leaf size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info Area */}
                    <div className="flex-grow text-center md:text-left space-y-2">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">{item.name}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        {/* Error Fixed here using optional chaining */}
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{item?.flavor || "Signature"}</span>
                        <div className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-[#ff4d6d] text-[10px] font-black uppercase px-3 py-1 bg-[#ff4d6d10] border border-[#ff4d6d20] rounded-full">
                          {item.weight} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price Row */}
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10">
                        <button 
                          onClick={() => updateQuantity(item._id, item.weight, Math.max(1, item.quantity - 1))} 
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-black text-sm w-10 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.weight, item.quantity + 1)} 
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Final Price Area */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-black text-white tracking-tighter">₹{itemSinglePrice * item.quantity}</p>
                          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">₹{itemSinglePrice} / pc</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id, item.weight)} 
                          className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500 border border-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT: CHECKOUT SUMMARY (4 Cols) --- */}
        <div className="lg:col-span-4">
          <div className="bg-[#0a0a0a] p-10 rounded-[3rem] sticky top-32 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic border-b border-white/5 pb-6 mb-8">Summary</h2>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <span>Subtotal Value</span>
                <span className="text-white">₹{total}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <span>Priority Logistics</span>
                <span className="text-green-500 italic">Complimentary</span>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-bold uppercase text-gray-600 mb-1">Total Net Worth</p>
                  <p className="text-5xl font-black text-white tracking-tighter">₹{total}</p>
                </div>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="space-y-4">
              {status === "authenticated" ? (
                <Link 
                  href="/checkout" 
                  className="w-full bg-[#ff4d6d] text-white py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,77,109,0.4)] transition-all active:scale-95"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              ) : (
                <button 
                  onClick={() => signIn()} 
                  className="w-full bg-white text-black py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#ff4d6d] hover:text-white transition-all shadow-xl active:scale-95"
                >
                  <Lock size={14} strokeWidth={3} /> Sign In to Secure
                </button>
              )}
              <div className="flex items-center justify-center gap-2 opacity-30 pt-4">
                <CheckCircle size={10} className="text-green-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Encrypted Transaction</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}