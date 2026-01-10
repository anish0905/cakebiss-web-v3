"use client";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

export default function AddToCartBtn({ cake }: { cake: any }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addToCart(cake);
    
    // 2 second baad wapas normal state
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      disabled={isAdding}
      className={`
        relative group overflow-hidden w-full py-4 px-6 rounded-2xl 
        font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-500
        flex items-center justify-center gap-3
        ${isAdding 
          ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
          : "bg-[#ff4d6d] text-white shadow-[0_10px_30px_rgba(255,77,109,0.3)] hover:shadow-[0_15px_40px_rgba(255,77,109,0.5)]"
        }
      `}
    >
      {/* ⚡ Background Animated Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

      {/* --- CONTENT --- */}
      <div className="flex items-center gap-2 relative z-10">
        {isAdding ? (
          <>
            <Sparkles size={14} className="animate-spin" />
            <span>SECURED IN CART</span>
          </>
        ) : (
          <>
            <ShoppingBag size={14} className="group-hover:rotate-12 transition-transform" />
            <span>ADD TO Cart</span>
          </>
        )}
      </div>
    </motion.button>
  );
}