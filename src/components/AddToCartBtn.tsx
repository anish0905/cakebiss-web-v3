"use client";
import { useCartStore } from "../store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Plus } from "lucide-react";
import { useState } from "react";

interface AddToCartProps {
  cake: any;
  selectedVariant: {
    weight: number;
    price: number;
    discountPrice: number;
    _id: any;
  };
}

export default function AddToCartBtn({ cake, selectedVariant }: AddToCartProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!selectedVariant) return;

    setIsAdding(true);
    addToCart({
      _id: cake._id,
      name: cake.name,
      price: selectedVariant.price,
      discountPrice: selectedVariant.discountPrice,
      image: cake.image,
      flavor: cake.flavor,
      weight: selectedVariant.weight,
      unit: cake.unit,
      isEggless: cake.isEggless,
      quantity: 1,
    });

    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleAdd}
      disabled={isAdding || !selectedVariant}
      className={`
        relative overflow-hidden w-full h-[52px] md:h-[60px] rounded-full
        font-black uppercase text-[9px] md:text-[11px] tracking-[0.3em]
        transition-all duration-700 ease-out flex items-center justify-center
        ${!selectedVariant ? "opacity-30 cursor-not-allowed grayscale" : "opacity-100"}
        ${isAdding 
          ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
          : "bg-[#ff4d6d] text-white shadow-[0_15px_35px_rgba(255,77,109,0.25)] hover:shadow-[0_20px_45px_rgba(255,77,109,0.4)]"
        }
      `}
    >
      {/* ⚡ Animated Aura Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      
      <div className="relative z-10 flex items-center justify-center w-full px-6">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div 
              key="added"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Check size={16} strokeWidth={3} className="text-green-500" />
              <span className="italic">Secured</span>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="mr-1">Add Selection</span>
              <span className="hidden md:inline opacity-40">|</span>
              <span className="hidden md:inline opacity-70">₹{selectedVariant?.discountPrice || selectedVariant?.price}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 border border-white/10 rounded-full" />
    </motion.button>
  );
}