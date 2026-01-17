"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ShieldCheck, Heart, ArrowRight, Leaf, Zap } from "lucide-react";
import Link from "next/link";
import FallingCakes from "../components/FallingCakes";
import AddToCartBtn from "../components/AddToCartBtn";
import CakeHero from "../components/CakeHero";

export default function Home() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Birthday", "Anniversary", "Wedding", "Bento Cake", "Customized"];

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCakes(json.data);
          setFilteredCakes(json.data.slice(0, 8));
        }
      });
  }, []);

  useEffect(() => {
    let result = cakes;
    if (activeCategory !== "All") {
      result = result.filter((c: any) => c.category === activeCategory);
    }
    setFilteredCakes(result.slice(0, 8));
  }, [activeCategory, cakes]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <FallingCakes />

      {/* --- 3D HERO SECTION --- */}
      <section className="relative z-20">
        <CakeHero />
      </section>

      {/* --- CATEGORY FILTER TABS --- */}
      <div className="sticky top-24 z-50 flex justify-center py-6 pointer-events-none">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap justify-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl pointer-events-auto"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-[#ff4d6d] text-white shadow-[0_0_20px_rgba(255,77,109,0.4)] scale-105" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* --- BEST SELLERS GRID --- */}
      <section className="relative py-24 px-6 max-w-[1440px] mx-auto z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#ff4d6d] animate-pulse" />
            <span className="text-[#ff4d6d] font-bold tracking-[0.5em] uppercase text-[10px]">The Signature Series</span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-serif italic text-white leading-none">
            Selected Masterpieces
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#ff4d6d] to-transparent mt-8" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredCakes.map((cake: any) => {
              // Lowest price nikalne ke liye base variant choose karein
              const baseVariant = cake.priceVariants?.[0] || { price: 0, weight: 0 };

              return (
                <motion.div 
                  layout key={cake._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} viewport={{ once: true }}
                  className="group relative bg-[#111] rounded-[3rem] overflow-hidden border border-white/5 hover:border-[#ff4d6d]/30 transition-all duration-500 flex flex-col shadow-2xl"
                >
                  {/* Image Section */}
                  <Link href={`/cakes/${cake._id}`} className="relative h-64 overflow-hidden block">
                    <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                    
                    {/* Dynamic Badges */}
                    <div className="absolute top-5 left-5 flex flex-col gap-2">
                      {cake.isEggless && (
                        <span className="bg-green-500/20 backdrop-blur-md text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                          <Leaf size={10} /> Eggless
                        </span>
                      )}
                      <span className="bg-[#ff4d6d] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit">
                        {cake.category}
                      </span>
                    </div>
                  </Link>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff4d6d] transition-colors uppercase tracking-tight italic">
                      {cake.name}
                    </h3>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-4 opacity-70">
                      Primary Flavor: {cake.flavor}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                      <div>
                        <span className="text-[9px] block text-gray-600 uppercase font-black tracking-widest mb-1">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white tracking-tighter">
                            ₹{baseVariant.discountPrice > 0 ? baseVariant.discountPrice : baseVariant.price}
                          </span>
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">/ {baseVariant.weight}{cake.unit}</span>
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#ff4d6d] transition-all group/btn">
                        <Link href={`/cakes/${cake._id}`}>
                           <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { icon: <Truck size={24}/>, title: "Artisan Delivery", sub: "Fast & Secured" },
            { icon: <ShieldCheck size={24}/>, title: "Hygiene First", sub: "Safety Guaranteed" },
            { icon: <Star size={24}/>, title: "Elite Taste", sub: "Chef's Signature" },
            { icon: <Heart size={24}/>, title: "Hand Crafted", sub: "Made with Love" },
          ].map((item, i) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={i} 
              className="flex flex-col items-center text-center gap-4 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#ff4d6d]/20 transition-all shadow-xl"
            >
              <div className="text-[#ff4d6d] p-4 bg-[#ff4d6d]/10 rounded-full">{item.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1">{item.title}</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="px-6 py-40 text-center relative">
         <div className="absolute inset-0 bg-gradient-to-t from-[#ff4d6d10] to-transparent pointer-events-none" />
         <motion.h2 
           initial={{ opacity: 0, scale: 0.9 }} 
           whileInView={{ opacity: 1, scale: 1 }}
           className="text-7xl md:text-[10rem] font-serif italic leading-none mb-12 tracking-tighter"
         >
           Baked for <br /> <span className="text-[#ff4d6d] not-italic font-black uppercase tracking-widest">Eternity.</span>
         </motion.h2>
         <Link 
            href="/cakes" 
            className="group inline-flex items-center gap-6 bg-white text-black px-14 py-6 rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#ff4d6d] hover:text-white transition-all duration-500 shadow-2xl"
          >
            Explore Collection 
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
      </section>
    </main>
  );
}