"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Leaf, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CakesPage() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Birthday", "Anniversary", "Wedding", "Bento Cake", "Customized"];

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCakes(json.data);
          setFilteredCakes(json.data);
        }
      });
  }, []);

  useEffect(() => {
    let result = cakes;
    if (activeCategory !== "All") {
      result = result.filter((c: any) => c.category === activeCategory);
    }
    if (search) {
      result = result.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.flavor.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCakes(result);
  }, [search, activeCategory, cakes]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-32 pb-20 px-4 md:px-10 font-sans text-white overflow-x-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[#ff4d6d]/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-10 md:mb-16 space-y-2 md:space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-[#ff4d6d]">
            <Sparkles size={12} className="animate-pulse" />
            <span className="uppercase tracking-[0.3em] text-[8px] md:text-[10px] font-black">The Royal Gallery</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic leading-none"
          >
            PURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] to-[#f9829b]">DREAMS.</span>
          </motion.h1>
        </div>

        {/* --- SEARCH & FILTER BAR (Responsive) --- */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Search Field */}
          <div className="relative w-full max-w-2xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ff4d6d] transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search flavor or name..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none text-white placeholder:text-gray-700 focus:border-[#ff4d6d]/50 text-xs transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Category Tabs (Horizontal Scroll on Mobile) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                  activeCategory === cat
                    ? "bg-[#ff4d6d] border-[#ff4d6d] text-white shadow-lg"
                    : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID DISPLAY (2 Cols on Mobile, 4 on Desktop) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCakes.map((cake: any) => {
              const baseVariant = cake.priceVariants?.[0] || { price: 0, weight: 0 };
              
              return (
                <motion.div 
                  layout key={cake._id} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-[#111] rounded-[1.8rem] md:rounded-[2.5rem] border border-white/5 flex flex-col h-full hover:border-[#ff4d6d40] transition-all duration-500 overflow-hidden"
                >
                  {/* Image Container */}
                  <Link href={`/cakes/${cake._id}`} className="relative aspect-[4/5] overflow-hidden block">
                    <img 
                      src={cake.image} 
                      alt={cake.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                    />
                    
                    {/* Compact Badges for Mobile */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {cake.isEggless && (
                        <div className="bg-green-500/80 backdrop-blur-md p-1 rounded-full shadow-lg border border-white/20">
                          <Leaf size={10} className="text-white" />
                        </div>
                      )}
                      <span className="bg-[#ff4d6d] text-white px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter w-fit">
                        {cake.category}
                      </span>
                    </div>
                  </Link>

                  {/* Content Area */}
                  <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <h3 className="text-xs md:text-lg font-bold text-white group-hover:text-[#ff4d6d] transition-colors uppercase tracking-tight line-clamp-1">
                      {cake.name}
                    </h3>
                    
                    <p className="text-gray-600 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                      {cake.flavor}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[7px] md:text-[9px] text-gray-500 font-bold uppercase tracking-tighter mb-0.5">Starting</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm md:text-xl font-black text-white">
                            ₹{baseVariant.discountPrice > 0 ? baseVariant.discountPrice : baseVariant.price}
                          </span>
                          <span className="text-[7px] md:text-[9px] text-gray-600 font-bold uppercase">{baseVariant.weight}{cake.unit}</span>
                        </div>
                      </div>

                      <Link 
                        href={`/cakes/${cake._id}`} 
                        className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#ff4d6d] transition-colors group/btn"
                      >
                        <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* --- EMPTY STATE --- */}
        {filteredCakes.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs italic">No masterpiece matches your search</p>
          </div>
        )}
      </div>
    </div>
  );
}