"use client";
import AddToCartBtn from "../../components/AddToCartBtn";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

export default function CakesPage() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Chocolate", "Wedding", "Birthday", "Custom"];

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
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCakes(result);
  }, [search, activeCategory, cakes]);

  return (
    // Background: Same as Home Page (#0a0a0a)
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6 font-sans text-white">
      
      {/* ⚡ Background Glow Effects (Home Page Style) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff4d6d05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7209b705] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-[#ff4d6d]"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold">The Royal Gallery</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter"
          >
            PURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] to-[#f9829b]">COLLECTION.</span>
          </motion.h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            Premium 3D desserts designed for the extraordinary.
          </p>
        </div>

        {/* Search & Filter Bar (Glassmorphism Style) */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-20 bg-white/5 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="relative w-full md:w-1/3 ml-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Find your flavor..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/5 border-none outline-none text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#ff4d6d] text-sm transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 border ${
                  activeCategory === cat
                    ? "bg-[#ff4d6d] border-[#ff4d6d] text-white shadow-[0_0_20px_rgba(255,77,109,0.4)]"
                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCakes.map((cake: any) => (
              <motion.div 
                layout
                key={cake._id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-[#111] rounded-[2.5rem] border border-white/5 flex flex-col h-full hover:border-[#ff4d6d50] transition-all duration-500 overflow-hidden shadow-2xl"
              >
                {/* Image Section */}
                <Link href={`/cakes/${cake._id}`} className="relative h-72 overflow-hidden block">
                  <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  
                  {/* Pink Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4">
                    <span className="bg-[#ff4d6d] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                      {cake.category}
                    </span>
                  </div>

                  {cake.discountPrice > 0 && (
                    <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                      Special Offer
                    </div>
                  )}
                </Link>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-grow relative">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff4d6d] transition-colors uppercase tracking-tight">
                    {cake.name}
                  </h3>
                  <p className="text-gray-500 text-xs italic line-clamp-2 mb-6 opacity-70">"{cake.description}"</p>
                  
                  <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">
                        ₹{cake.discountPrice > 0 ? cake.discountPrice : cake.price}
                      </span>
                      {cake.discountPrice > 0 && (
                        <span className="text-[10px] text-gray-600 line-through">₹{cake.price}</span>
                      )}
                    </div>

                    {cake.quantity > 0 ? (
                      <div className="hover:scale-110 transition-transform">
                        <AddToCartBtn cake={cake} />
                      </div>
                    ) : (
                      <span className="text-[8px] font-bold uppercase text-gray-600 border border-white/10 px-3 py-1 rounded-full">Sold Out</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}