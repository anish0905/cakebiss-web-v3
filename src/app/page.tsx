"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import FallingCakes from "../components/FallingCakes";
import AddToCartBtn from "../components/AddToCartBtn";
import CakeHero from "../components/CakeHero";

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
        setFilteredCakes(json.data.slice(0, 8));
      });
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredCakes(cakes.slice(0, 8));
    } else {
      setFilteredCakes(cakes.filter((c: any) => c.category === activeCategory));
    }
  }, [activeCategory, cakes]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <FallingCakes />

      {/* --- 3D HERO SECTION --- */}
      <section className="relative z-20">
        <CakeHero />
      </section>

      {/* --- CATEGORY FILTER TABS (Floating & Sticky) --- */}
      <div className="sticky top-4 z-50 flex justify-center py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap justify-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-[#ff4d6d] text-white shadow-[0_0_20px_rgba(255,77,109,0.4)] scale-105" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
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
          <motion.span 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="text-[#ff4d6d] font-bold tracking-[0.5em] uppercase text-xs mb-4"
          >
            Our Signature
          </motion.span>
          <h2 className="text-5xl md:text-8xl font-serif italic text-white leading-none">
            The Masterpieces
          </h2>
          <div className="w-24 h-[1px] bg-[#ff4d6d] mt-8" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCakes.map((cake: any) => (
              <motion.div 
                layout
                key={cake._id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                className="group relative bg-[#151515] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#ff4d6d]/30 transition-all duration-500 h-[520px] flex flex-col"
              >
                {/* Image Section */}
                <Link href={`/cakes/${cake._id}`} className="relative h-64 overflow-hidden block">
                  <img 
                    src={cake.image} 
                    alt={cake.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-60" />
                  
                  {/* Badge UI */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <span className="bg-[#ff4d6d] text-white px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-tighter">
                      {cake.category}
                    </span>
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff4d6d] transition-colors uppercase tracking-tight">
                    {cake.name}
                  </h3>
                  <p className="text-gray-500 text-xs italic line-clamp-2 mb-6 font-medium leading-relaxed">
                    "{cake.description}"
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                      <span className="text-[10px] block text-gray-600 uppercase font-black tracking-widest">Price</span>
                      <span className="text-2xl font-black text-white tracking-tighter">₹{cake.discountPrice || cake.price}</span>
                    </div>

                    {cake.quantity > 0 ? (
                      <div className="transform transition-transform active:scale-95">
                        <AddToCartBtn cake={cake}/>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">Sold Out</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- TRUST BADGES (Dark Glassmorphism) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ff4d6d]/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {[
            { icon: <Truck size={28}/>, title: "Fast Delivery", sub: "Under 2 Hours" },
            { icon: <ShieldCheck size={28}/>, title: "100% Fresh", sub: "No Preservatives" },
            { icon: <Star size={28}/>, title: "Premium Taste", sub: "Chef's Special" },
            { icon: <Heart size={28}/>, title: "Made with Love", sub: "Purely Artisanal" },
          ].map((item, i) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={i} 
              className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
            >
              <div className="text-[#ff4d6d]">{item.icon}</div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] mb-1">{item.title}</p>
                <p className="text-[10px] text-gray-500 font-medium">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="px-6 py-40 bg-gradient-to-b from-[#0a0a0a] to-[#000] relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-9xl font-serif italic leading-none mb-10">
            Let's Bake <br /> <span className="text-[#ff4d6d] not-italic font-black uppercase tracking-tighter">Your Dreams.</span>
          </h2>
          <Link 
            href="/contact" 
            className="group relative inline-flex items-center gap-4 bg-[#ff4d6d] text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_rgba(255,77,109,0.3)]"
          >
            Start Custom Order 
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}