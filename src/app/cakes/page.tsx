"use client";
import AddToCartBtn from "../../components/AddToCartBtn";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowRight, Tag } from "lucide-react";
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
    <div className="min-h-screen bg-[#fffcf9] pt-28 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic text-black"
          >
            The Collection
          </motion.h1>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em]">Handcrafted for your finest celebrations</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Search by flavor or name..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border-none outline-none focus:ring-2 focus:ring-cake-gold font-medium text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
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
                className="group bg-white rounded-[2.5rem] border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Image Section with Detail Link */}
                <Link href={`/cakes/${cake._id}`} className="relative h-72 overflow-hidden block">
                  <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  
                  {/* Category & Weight Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{cake.category}</span>
                    <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-black/5">{cake.weight}{cake.unit}</span>
                  </div>

                  {/* Discount Badge */}
                  {cake.discountPrice > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                      OFFER
                    </div>
                  )}
                </Link>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif font-black italic text-black mb-2">{cake.name}</h3>
                  <p className="text-gray-400 text-[10px] font-medium italic line-clamp-2 mb-4">"{cake.description}"</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      {cake.discountPrice > 0 ? (
                        <>
                          <span className="text-[10px] block text-gray-300 line-through">₹{cake.price}</span>
                          <span className="text-xl font-black text-black">₹{cake.discountPrice}</span>
                        </>
                      ) : (
                        <span className="text-xl font-black text-black">₹{cake.price}</span>
                      )}
                    </div>

                    {cake.quantity > 0 ? (
                      <AddToCartBtn cake={cake} />
                    ) : (
                      <span className="text-[8px] font-black uppercase text-red-500 bg-red-50 px-3 py-1.5 rounded-full">Out of Stock</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredCakes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-gray-400 font-serif italic text-2xl">No masterpieces found matching your search. 🍰</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}