"use client";
import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ShieldCheck, ArrowLeft, Zap, Leaf, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import AddToCartBtn from "../../../components/AddToCartBtn";

export default function CakeDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cake, setCake] = useState<any>(null);
  const [activeImg, setActiveImg] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCake(json.data);
          setActiveImg(json.data.image);
          if (json.data.priceVariants?.length > 0) setSelectedVariant(json.data.priceVariants[0]);
        }
      });
  }, [id]);

  if (!cake) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#ff4d6d] border-t-transparent rounded-full animate-spin" /></div>;

  const allImages = [cake.image, ...(cake.extraImages || [])];

  return (
    // Added pt-24 for mobile and md:pt-32 for desktop to give space for fixed Navbar
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff4d6d] pb-32 md:pb-20 pt-24 md:pt-32">
      
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        
        {/* Navigation - Back Button with clear spacing */}
        <Link href="/cakes" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-[#ff4d6d] mb-8 transition-all">
          <ArrowLeft size={14} /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          
          {/* --- LEFT: IMAGE SECTION --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#111] border border-white/5 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={activeImg} 
                  className="w-full h-full object-cover" 
                  alt={cake.name} 
                />
              </AnimatePresence>
              
              {cake.isEggless && (
                <div className="absolute top-6 left-6 backdrop-blur-md bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2">
                  <Leaf size={12} /> EGGLESS
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(img)}
                  className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? "border-[#ff4d6d] scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="preview" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#ff4d6d]">
                <Zap size={12} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{cake.flavor} LUXE</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-[0.9] uppercase">
                {cake.name}
              </h1>
              <div className="flex items-center gap-3 text-gray-500">
                <Star size={12} fill="#ff4d6d" className="text-[#ff4d6d]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{cake.category} Collection</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed italic border-l-2 border-[#ff4d6d]/20 pl-6">
              {cake.description}
            </p>

            {/* Weight Selection */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Select Dimensions</p>
              <div className="flex flex-wrap gap-3">
                {cake.priceVariants?.map((variant: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all border-2 ${
                      selectedVariant?.weight === variant.weight 
                      ? "bg-white text-black border-white shadow-xl" 
                      : "bg-transparent border-white/5 text-gray-500 hover:border-white/20"
                    }`}
                  >
                    {variant.weight}{cake.unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Action Bar */}
            <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Final Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">
                      ₹{selectedVariant?.discountPrice || selectedVariant?.price}
                    </span>
                    {selectedVariant?.discountPrice > 0 && (
                      <span className="text-sm text-gray-700 line-through">₹{selectedVariant.price}</span>
                    )}
                  </div>
                </div>
                <div className="w-44">
                  <AddToCartBtn cake={cake} selectedVariant={selectedVariant} />
                </div>
              </div>
            </div>

            {/* Trust Badges Row */}
            <div className="flex justify-between items-center py-4 px-2 opacity-50">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                <Truck size={14} /> Express
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Hygienic
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                <Star size={14} /> 5-Star
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}