"use client";
import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ShieldCheck, ArrowLeft, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import AddToCartBtn from "../../../components/AddToCartBtn";

export default function CakeDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cake, setCake] = useState<any>(null);
  const [activeImg, setActiveImg] = useState("");
  const [relatedCakes, setRelatedCakes] = useState([]);

  useEffect(() => {
    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setCake(json.data);
        setActiveImg(json.data.image);
        fetch(`/api/cakes?category=${json.data.category}&limit=4`)
          .then(r => r.json())
          .then(related => setRelatedCakes(related.data.filter((c:any) => c._id !== id)));
      });
  }, [id]);

  if (!cake) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="w-10 h-10 border-2 border-[#ff4d6d] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#ff4d6d]" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] pb-20 pt-24 px-5 text-white overflow-hidden relative">
      
      {/* 🔮 Background Glows */}
      <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-[#ff4d6d08] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Back Link - Smaller for Mobile */}
        <Link href="/cakes" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-500 hover:text-[#ff4d6d] transition-all">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          
          {/* --- LEFT: HD GALLERY --- */}
          <div className="space-y-5">
            <motion.div 
              layoutId={`cake-${cake._id}`}
              className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-[#0a0a0a] border border-white/5"
            >
              <img src={activeImg} className="w-full h-full object-cover" alt={cake.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute top-6 left-6">
                <span className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                  {cake.category}
                </span>
              </div>
            </motion.div>

            {/* Thumbnails - Smaller for mobile */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {[cake.image, ...(cake.extraImages || [])].slice(0, 4).map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(img)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden border transition-all ${activeImg === img ? "border-[#ff4d6d] scale-95" : "border-white/5 opacity-40"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="pt-2">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#ff4d6d]">
                  <Zap size={12} fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Artisan Craft</span>
                </div>
                
                {/* Heading: Optimized size for mobile */}
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-black leading-[1] tracking-tighter uppercase italic">
                  {cake.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex text-[#ff4d6d] gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <span className="text-[8px] font-bold uppercase text-gray-600 tracking-widest">Premium Selection</span>
                </div>
              </div>

              {/* Description: Smaller & cleaner */}
              <p className="text-gray-400 text-base md:text-xl leading-relaxed font-light italic border-l border-[#ff4d6d]/20 pl-5">
                {cake.description}
              </p>

              {/* Price & Weight - Compact Grid */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-600 tracking-[0.2em] mb-2">Price</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-5xl font-black tracking-tighter text-white">₹{cake.discountPrice || cake.price}</span>
                    {cake.discountPrice > 0 && <span className="text-sm text-gray-700 line-through">₹{cake.price}</span>}
                  </div>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase text-gray-600 tracking-[0.2em] mb-2">Net Weight</p>
                  <span className="text-xl md:text-3xl font-black uppercase text-[#ff4d6d]">{cake.weight} {cake.unit}</span>
                </div>
              </div>

              {/* Actions - Better stacked for mobile */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="h-16">
                  <AddToCartBtn cake={cake} />
                </div>
                <button className="h-16 rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  Request Custom Details
                </button>
              </div>

              {/* Features - Horizontal on mobile */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Truck className="text-[#ff4d6d]" size={16} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 text-center">Express Delivery</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <ShieldCheck className="text-[#ff4d6d]" size={16} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 text-center">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED SECTION - Scaled down for mobile */}
        {relatedCakes.length > 0 && (
          <section className="mt-24 border-t border-white/5 pt-16">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-10">You may also <span className="text-[#ff4d6d]">like</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedCakes.map((c: any) => (
                <Link href={`/cakes/${c._id}`} key={c._id} className="group">
                  <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 bg-[#111] border border-white/5">
                    <img src={c.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                  </div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{c.name}</h4>
                  <p className="text-[#ff4d6d] font-black text-xs tracking-tighter mt-1">₹{c.discountPrice || c.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}