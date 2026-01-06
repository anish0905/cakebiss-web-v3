"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ShieldCheck, Heart, ArrowRight, Tag, Filter } from "lucide-react";
import Link from "next/link";
import FallingCakes from "../components/FallingCakes";
import AddToCartBtn from "../components/AddToCartBtn";

export default function Home() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Chocolate", "Wedding", "Birthday", "Custom"];

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((json) => {
        setCakes(json.data);
        setFilteredCakes(json.data.slice(0, 8)); // Starting mein 8 best sellers dikhayenge
      });
  }, []);

  // Filter Logic
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredCakes(cakes.slice(0, 8));
    } else {
      setFilteredCakes(cakes.filter((c: any) => c.category === activeCategory));
    }
  }, [activeCategory, cakes]);

  return (
    <main className="min-h-screen bg-[#fffcf9] overflow-hidden font-sans">
      <FallingCakes />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cake-gold/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cake-brown/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto z-10">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cake-gold font-black tracking-[0.4em] uppercase text-[10px] md:text-xs mb-6 block underline underline-offset-8 decoration-cake-gold/30">Est. 2024 • Artisanal Patisserie</motion.span>
          <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-6xl md:text-9xl font-serif text-black mb-8 leading-[1] italic tracking-tight">Handcrafted <br /> <span className="not-italic font-black text-cake-gold">Boutique</span> Cakes</motion.h1>
          <Link href="/cakes" className="bg-black text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest hover:shadow-2xl hover:bg-cake-gold hover:text-black transition-all inline-flex items-center gap-3">Explore Full Menu <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* --- CATEGORY FILTER TABS --- */}
      <div className="flex flex-wrap justify-center gap-4 px-6 mb-16 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat 
              ? "bg-black text-white shadow-xl scale-110" 
              : "bg-white text-gray-400 border border-gray-100 hover:border-cake-gold"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- BEST SELLERS GRID --- */}
      <section className="py-10 px-6 max-w-[1440px] mx-auto min-h-[600px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-7xl font-serif text-black italic leading-none">The Masterpieces</h2>
            <p className="mt-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Hand-picked for your special moments</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredCakes.map((cake: any, idx) => (
              <motion.div 
                layout
                key={cake._id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 relative"
              >
                {/* Image & Click to Detail */}
                <Link href={`/cakes/${cake._id}`} className="relative h-80 overflow-hidden cursor-pointer block">
                  <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  
                  {/* Sale Badge logic */}
                  {cake.discountPrice > 0 && (
                    <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-tighter shadow-xl z-20">
                      SAVE ₹{cake.price - cake.discountPrice}
                    </div>
                  )}
                  
                  <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                    <span className="bg-black/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">{cake.category}</span>
                    <span className="bg-white/90 backdrop-blur-sm text-black px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-black/5">{cake.weight} {cake.unit}</span>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest">View Details</span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow text-center">
                  <h3 className="text-2xl font-serif font-black mb-3 italic text-black leading-tight">{cake.name}</h3>
                  <p className="text-gray-400 text-xs mb-8 italic leading-relaxed line-clamp-2 px-2">"{cake.description}"</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="text-left">
                      {cake.discountPrice > 0 ? (
                        <>
                          <span className="text-[10px] block text-gray-300 line-through font-bold">₹{cake.price}</span>
                          <span className="text-2xl font-black text-black tracking-tighter">₹{cake.discountPrice}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] block text-gray-400 uppercase font-black tracking-tighter">Premium</span>
                          <span className="text-2xl font-black text-black tracking-tighter">₹{cake.price}</span>
                        </>
                      )}
                    </div>

                    {cake.quantity > 0 ? (
                      <AddToCartBtn cake={cake}/>
                    ) : (
                      <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100">Sold Out</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <section className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { icon: <Truck size={24}/>, title: "Swift Delivery", sub: "Under 2 Hours" },
            { icon: <ShieldCheck size={24}/>, title: "100% Organic", sub: "Fresh Ingredients" },
            { icon: <Star size={24}/>, title: "Top Rated", sub: "4.9/5 Stars" },
            { icon: <Heart size={24}/>, title: "Artisan Soul", sub: "Made with Love" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="text-cake-gold">{item.icon}</div>
              <p className="text-[10px] font-black uppercase tracking-widest">{item.title}</p>
              <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6 py-32 bg-[#111] text-white">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-5xl md:text-8xl font-serif italic leading-none">Celebrate with Art.</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">Custom masterpieces designed specifically for your most cherished moments.</p>
          <Link href="/contact" className="inline-block bg-cake-gold text-black px-16 py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white transition-all shadow-2xl">Start Your Custom Order</Link>
        </div>
      </section>
    </main>
  );
}